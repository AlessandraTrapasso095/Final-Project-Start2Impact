// questo file mi serve per gestire la dashboard task board dopo il login.
// lo uso per caricare la board, creare task, aggiornare card e cancellarle restando tutto nello stesso flusso frontend.

import { startTransition, useEffect, useState } from "react";
import AuthenticatedPanel from "../auth/AuthenticatedPanel.jsx";
import FormField from "../forms/FormField.jsx";
import Button from "../ui/Button.jsx";
import FeedbackPanel from "../ui/FeedbackPanel.jsx";
import LoadingRing from "../ui/LoadingRing.jsx";
import SurfaceCard from "../ui/SurfaceCard.jsx";
import TaskCard from "./TaskCard.jsx";
import {
  createTaskItem,
  deleteTaskItem,
  getTaskBoard,
  updateTaskItem,
} from "../../services/task-api.js";

const initialTaskDraft = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
};

const emptyTaskBoard = {
  tasks: [],
  summary: {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
  },
};

const boardColumns = [
  {
    key: "todo",
    title: "Da iniziare",
    description: "Qui tengo le attivita' appena inserite o rimesse in lista.",
  },
  {
    key: "in-progress",
    title: "In corso",
    description: "Qui sposto quello che il team sta lavorando adesso.",
  },
  {
    key: "done",
    title: "Completati",
    description: "Qui finiscono i task chiusi e pronti da archiviare.",
  },
];

const nextStatusMap = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

const nextPriorityMap = {
  low: "medium",
  medium: "high",
  high: "low",
};

const taskFieldOptions = {
  status: [
    { value: "todo", label: "Da iniziare" },
    { value: "in-progress", label: "In corso" },
    { value: "done", label: "Completato" },
  ],
  priority: [
    { value: "low", label: "Bassa" },
    { value: "medium", label: "Media" },
    { value: "high", label: "Alta" },
  ],
};

const createBoardFeedback = (message, tone = "neutral", details = []) => ({
  tone,
  message,
  details,
});

// mi serve per mostrare un saluto coerente con il profilo dell'utente.
// prima controllo il genere salvato, poi faccio un fallback leggero sul nome se il campo non e' stato ancora impostato.
const getWelcomePrefix = (user) => {
  if (user?.profile?.gender === "male") {
    return "Benvenuto nel workspace,";
  }

  if (user?.profile?.gender === "female") {
    return "Benvenuta nel workspace,";
  }

  const firstName = String(user?.name || "")
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase();

  return firstName && firstName.endsWith("o")
    ? "Benvenuto nel workspace,"
    : "Benvenuta nel workspace,";
};

// mi serve per validare il task prima di inviarlo al backend.
// lo uso per evitare submit vuoti e dare feedback immediato gia' dal frontend.
const validateTaskDraft = (taskDraft) => {
  const nextErrors = {};

  if (taskDraft.title.trim().length < 3) {
    nextErrors.title = "Il titolo deve avere almeno 3 caratteri.";
  }

  return nextErrors;
};

// mi serve per raggruppare i task nelle tre colonne della board.
// questo mi permette di rendere la dashboard in modo pulito senza rifare filtri dentro il jsx.
const groupTasksByStatus = (tasks) =>
  boardColumns.reduce((groupedTasks, column) => {
    groupedTasks[column.key] = tasks.filter((task) => task.status === column.key);
    return groupedTasks;
  }, {});

// mi serve per comporre la dashboard vera dopo il login.
// qui tengo sincronizzazione board, form nuovo task e azioni rapide sulle card.
function TaskBoardPanel({
  user,
  session,
  onSessionExpired,
  onActivity = () => {},
  feedPanel = null,
}) {
  const welcomePrefix = getWelcomePrefix(user);
  const [taskDraft, setTaskDraft] = useState(initialTaskDraft);
  const [fieldErrors, setFieldErrors] = useState({});
  const [boardData, setBoardData] = useState(emptyTaskBoard);
  const [feedback, setFeedback] = useState(
    createBoardFeedback("Sto preparando le attivita' del team...", "neutral"),
  );
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const [isRefreshingBoard, setIsRefreshingBoard] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  const groupedTasks = groupTasksByStatus(boardData.tasks);
  const shouldShowBoardFeedback = isLoadingBoard || feedback.tone === "warning";

  // mi serve per centralizzare la gestione degli errori delle api task.
  // se il token non vale piu', riporto subito il frontend allo stato guest invece di lasciare la board rotta.
  const handleTaskError = (error, fallbackMessage) => {
    if (error?.statusCode === 401) {
      onSessionExpired(error.message);
      return true;
    }

    setFeedback(
      createBoardFeedback(
        error instanceof Error && error.message ? error.message : fallbackMessage,
        "warning",
        Array.isArray(error?.details) ? error.details : [],
      ),
    );
    return false;
  };

  // mi serve per ricaricare task e riepilogo dal backend.
  // lo uso sia all'apertura della dashboard sia dopo ogni create, update o delete.
  const refreshTaskBoard = async ({ showLoader = false, successMessage = "" } = {}) => {
    if (showLoader) {
      setIsLoadingBoard(true);
    }

    try {
      const nextBoardData = await getTaskBoard(session.token);

      startTransition(() => {
        setBoardData(nextBoardData);
      });
      setLastSyncedAt(new Date().toISOString());

      setFeedback(
        createBoardFeedback(
          successMessage ||
            (nextBoardData.tasks.length > 0
              ? `Elenco aggiornato. Vedo ${nextBoardData.summary.total} task attivi.`
              : "Elenco aggiornato. Posso iniziare creando il primo task."),
          successMessage || nextBoardData.tasks.length > 0 ? "success" : "neutral",
        ),
      );

      return nextBoardData;
    } catch (error) {
      handleTaskError(error, "Non sono riuscita a recuperare le attivita'.");
      return null;
    } finally {
      if (showLoader) {
        setIsLoadingBoard(false);
      }
    }
  };

  useEffect(() => {
    refreshTaskBoard({ showLoader: true });
  }, [session.token]);

  const formatSyncDate = (value) => {
    if (!value) {
      return "Non ancora sincronizzata";
    }

    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  // mi serve per aggiornare il form del nuovo task campo per campo.
  // lo uso anche per pulire l'errore di quel campo appena riprendo a scrivere.
  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setTaskDraft((currentTaskDraft) => ({
      ...currentTaskDraft,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  // mi serve per eseguire tutte le mutazioni task con lo stesso schema.
  // questo tiene insieme loading, feedback finale e refresh della board senza duplicare blocchi try/catch.
  const runTaskMutation = async ({
    taskId = "",
    loadingMessage,
    successMessage,
    requestHandler,
    isCreateAction = false,
  }) => {
    if (isCreateAction) {
      setIsCreatingTask(true);
    } else {
      setPendingTaskId(taskId);
    }

    setFeedback(createBoardFeedback(loadingMessage, "neutral"));

    try {
      await requestHandler();
      const refreshedBoard = await refreshTaskBoard({ successMessage });

      if (refreshedBoard) {
        onActivity();
      }

      return Boolean(refreshedBoard);
    } catch (error) {
      handleTaskError(error, "La modifica del task non e' andata a buon fine.");
      return false;
    } finally {
      if (isCreateAction) {
        setIsCreatingTask(false);
      } else {
        setPendingTaskId("");
      }
    }
  };

  // mi serve per creare un task nuovo dalla dashboard.
  // quando il backend conferma il salvataggio, pulisco il form e risincronizzo subito le colonne.
  const handleCreateTask = async (event) => {
    event.preventDefault();

    const nextErrors = validateTaskDraft(taskDraft);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFeedback(createBoardFeedback("Controllo il form del task prima di salvarlo.", "warning"));
      return;
    }

    const hasBeenCreated = await runTaskMutation({
      isCreateAction: true,
      loadingMessage: "Sto aggiungendo il task alla board...",
      successMessage: "Task creato. La board e' stata aggiornata.",
      requestHandler: () => createTaskItem(session.token, {
        title: taskDraft.title.trim(),
        description: taskDraft.description.trim(),
        status: taskDraft.status,
        priority: taskDraft.priority,
      }),
    });

    if (!hasBeenCreated) {
      return;
    }

    setTaskDraft(initialTaskDraft);
    setFieldErrors({});
  };

  // mi serve per spostare rapidamente un task allo stato successivo.
  // lo uso per avere una micro board interattiva senza aprire modali o editor extra.
  const handleAdvanceStatus = async (task) => {
    await runTaskMutation({
      taskId: task.id,
      loadingMessage: `Sto aggiornando lo stato di "${task.title}"...`,
      successMessage: `Task aggiornato. "${task.title}" e' stato spostato nella colonna corretta.`,
      requestHandler: () =>
        updateTaskItem(session.token, task.id, {
          status: nextStatusMap[task.status] || "todo",
        }),
    });
  };

  // mi serve per cambiare rapidamente la priorita' di una card.
  // questo mi da' una forma semplice di update reale gia' utile da mostrare nel progetto finale.
  const handleCyclePriority = async (task) => {
    await runTaskMutation({
      taskId: task.id,
      loadingMessage: `Sto cambiando la priorita' di "${task.title}"...`,
      successMessage: `Priorita' aggiornata per "${task.title}".`,
      requestHandler: () =>
        updateTaskItem(session.token, task.id, {
          priority: nextPriorityMap[task.priority] || "medium",
        }),
    });
  };

  // mi serve per eliminare una card dalla board.
  // lo uso per completare il flusso CRUD direttamente dall'interfaccia senza passaggi manuali.
  const handleDeleteTask = async (task) => {
    await runTaskMutation({
      taskId: task.id,
      loadingMessage: `Sto eliminando "${task.title}" dalla board...`,
      successMessage: `Task eliminato. La board e' stata aggiornata.`,
      requestHandler: () => deleteTaskItem(session.token, task.id),
    });
  };

  // mi serve per ricaricare manualmente la board quando voglio un sync esplicito.
  // questo e' utile sia in demo sia in fase di test, perche' posso forzare una nuova lettura dal backend con un click.
  const handleManualRefresh = async () => {
    setIsRefreshingBoard(true);
    await refreshTaskBoard({
      showLoader: false,
      successMessage: "Board aggiornata. Le ultime modifiche sono state caricate.",
    });
    setIsRefreshingBoard(false);
  };

  return (
    <div className="task-board" id="task-board">
      <section className="task-board__hero" id="dashboard">
        <p className="task-board__eyebrow">Workspace</p>
        <h1 className="task-board__title">
          <span className="task-board__title-line">{welcomePrefix}</span>
          <span className="task-board__title-line task-board__title-line--name">{user.name}</span>
        </h1>

        <div className="task-board__stats">
          <article className="task-board__stat-card">
            <span>Task totali</span>
            <strong>{boardData.summary.total}</strong>
          </article>

          <article className="task-board__stat-card">
            <span>In corso</span>
            <strong className="task-board__stat-card-value--accent">{boardData.summary.inProgress}</strong>
          </article>

          <article className="task-board__stat-card">
            <span>Completati</span>
            <strong>{boardData.summary.done}</strong>
          </article>
        </div>
      </section>

      <div className="task-board__overview">
        <AuthenticatedPanel
          user={user}
          session={session}
        />

        <SurfaceCard
          eyebrow="Sincronizzazione"
          title="Panoramica rapida"
          className="task-board__toolbar task-board__toolbar--accent"
        >
          <div className="task-board__toolbar-grid">
            <div>
              <span>Ultimo aggiornamento</span>
              <strong>{formatSyncDate(lastSyncedAt)}</strong>
            </div>
            <div>
              <span>Task aperti</span>
              <strong>{boardData.summary.total}</strong>
            </div>
          </div>

          <div className="task-board__toolbar-actions">
            <Button
              variant="secondary"
              onClick={handleManualRefresh}
              disabled={isRefreshingBoard || isLoadingBoard}
            >
              {isRefreshingBoard ? "Sto aggiornando..." : "Aggiorna elenco"}
            </Button>
          </div>
        </SurfaceCard>
      </div>

      {shouldShowBoardFeedback ? (
        <FeedbackPanel
          tone={feedback.tone}
          message={feedback.message}
          details={feedback.details}
          isLoading={isLoadingBoard}
          loadingLabel="Sto caricando le attivita' del team..."
        />
      ) : null}

      <section className="task-board__kanban">
        {isLoadingBoard ? (
          <SurfaceCard
            eyebrow="Attivita'"
            title="Sto preparando le attivita'"
          >
            <LoadingRing label="Sto preparando le attivita'..." />
          </SurfaceCard>
        ) : (
          <div className="task-board__columns">
            {boardColumns.map((column) => (
              <SurfaceCard
                key={column.key}
                eyebrow={column.title}
                title={`${groupedTasks[column.key]?.length || 0} task`}
                description={column.description}
                className="task-column"
              >
                {groupedTasks[column.key]?.length ? (
                  <div className="task-column__list">
                    {groupedTasks[column.key].map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isPending={pendingTaskId === task.id}
                        onAdvanceStatus={handleAdvanceStatus}
                        onCyclePriority={handleCyclePriority}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="task-column__empty">
                    <p>Nessun task in questa colonna.</p>
                  </div>
                )}
              </SurfaceCard>
            ))}
          </div>
        )}
      </section>

      <div className="task-board__bottom-grid">
        <div className="task-board__bottom-left" id="nuovo-task">
          <SurfaceCard
            eyebrow="Nuovo task"
            title="Aggiungi una nuova attivita'"
            className="task-board__composer task-board__composer--compact"
          >
            <form className="task-form" onSubmit={handleCreateTask}>
              <div className="task-form__grid">
                <FormField
                  label="Titolo task"
                  name="title"
                  value={taskDraft.title}
                  onChange={handleFieldChange}
                  placeholder="Per esempio: Preparare la presentazione finale"
                  error={fieldErrors.title}
                />

                <FormField
                  as="select"
                  label="Stato iniziale"
                  name="status"
                  value={taskDraft.status}
                  onChange={handleFieldChange}
                  options={taskFieldOptions.status}
                />

                <FormField
                  as="select"
                  label="Priorita'"
                  name="priority"
                  value={taskDraft.priority}
                  onChange={handleFieldChange}
                  options={taskFieldOptions.priority}
                />

                <FormField
                  as="textarea"
                  label="Descrizione"
                  name="description"
                  value={taskDraft.description}
                  onChange={handleFieldChange}
                  placeholder="Scrivo due righe per ricordarmi cosa devo fare..."
                  rows={4}
                />
              </div>

              <div className="task-form__actions">
                <Button type="submit" size="large" disabled={isCreatingTask}>
                  {isCreatingTask ? "Sto salvando..." : "Crea task"}
                </Button>
              </div>
            </form>
          </SurfaceCard>
        </div>

        <div className="task-board__bottom-right">{feedPanel}</div>
      </div>
    </div>
  );
}

export default TaskBoardPanel;
