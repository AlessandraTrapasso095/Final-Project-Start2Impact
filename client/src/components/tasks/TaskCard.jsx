// questo file mi serve per mostrare una card task leggibile e riusabile dentro la board.
// lo uso per tenere insieme etichette, date e azioni rapide senza appesantire il componente principale della dashboard.

import Button from "../ui/Button.jsx";
import StatusPill from "../ui/StatusPill.jsx";

const statusToneMap = {
  todo: "neutral",
  "in-progress": "warning",
  done: "success",
};

const priorityToneMap = {
  low: "success",
  medium: "neutral",
  high: "warning",
};

const statusLabelMap = {
  todo: "Da iniziare",
  "in-progress": "In corso",
  done: "Completato",
};

const priorityLabelMap = {
  low: "Priorita' bassa",
  medium: "Priorita' media",
  high: "Priorita' alta",
};

const nextStatusActionMap = {
  todo: "Avvia task",
  "in-progress": "Segna completato",
  done: "Riporta in lista",
};

// mi serve per stampare ogni task con tutte le azioni veloci che mi servono in dashboard.
// questo componente riceve il task e delega al parent solo le azioni vere di update e delete.
function TaskCard({ task, isPending, onAdvanceStatus, onCyclePriority, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card__badges">
        <StatusPill tone={statusToneMap[task.status] || "neutral"}>
          {statusLabelMap[task.status] || task.status}
        </StatusPill>
        <StatusPill tone={priorityToneMap[task.priority] || "neutral"}>
          {priorityLabelMap[task.priority] || task.priority}
        </StatusPill>
      </div>

      <div className="task-card__copy">
        <h4 className="task-card__title">{task.title}</h4>
        <p className="task-card__description">
          {task.description || "Per ora non ho aggiunto una descrizione a questo task."}
        </p>
      </div>

      <div className="task-card__actions">
        <Button
          variant="secondary"
          onClick={() => onAdvanceStatus(task)}
          disabled={isPending}
        >
          {isPending ? "Aggiorno..." : nextStatusActionMap[task.status]}
        </Button>

        <Button
          variant="ghost"
          onClick={() => onCyclePriority(task)}
          disabled={isPending}
        >
          {isPending ? "Attendi..." : "Priorita'"}
        </Button>

        <Button
          variant="danger"
          className="task-card__delete"
          onClick={() => onDelete(task)}
          disabled={isPending}
        >
          {isPending ? "Sto eliminando..." : "Elimina"}
        </Button>
      </div>
    </article>
  );
}

export default TaskCard;
