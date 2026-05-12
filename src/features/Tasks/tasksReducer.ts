import { arrayMove } from "@dnd-kit/sortable";
import type { CryptoUUID, TaskType } from "./Tasks";
import type { DragEndEvent } from "@dnd-kit/core";

type TaskAction = {
  type:
    | "load"
    | "new"
    | "delete"
    | "complete"
    | "activate"
    | "activate_next"
    | "sort"
    | "modify"
    | "save_edit";
  id?: CryptoUUID;
  newTaskName?: string;
  updatedTaskName?: string;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  event?: DragEndEvent;
  setDraftEdit?: React.Dispatch<React.SetStateAction<string>>;
};

export default function tasksReducer(
  tasks: TaskType[],
  action: TaskAction
): TaskType[] {
  switch (action.type) {
    case "load": {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : tasks;
    }
    case "new": {
      if (!action.newTaskName) return tasks;
      const newTask: TaskType = {
        id: crypto.randomUUID(),
        name: action.newTaskName,
        completed: false,
        active: tasks.length === 0 ? true : false,
      };
      const updated = [...tasks, newTask];
      localStorage.setItem("tasks", JSON.stringify(updated));

      return updated;
    }
    case "complete": {
      if (!action.id) return tasks;
      const completedIndex = tasks.findIndex((task) => task.id === action.id);
      const wasUncompleted = !tasks[completedIndex]?.completed;
      const updated = tasks.map((task) => {
        if (task.id !== action.id) return task;
        const target_completed = !task.completed;
        if (target_completed && action.audioRef) {
          action.audioRef.current?.play();
        }
        return {
          ...task,
          completed: target_completed,
          active: target_completed ? false : task.active,
        };
      });
      if (wasUncompleted) {
        for (let i = completedIndex + 1; i < updated.length; i++) {
          if (!updated[i].completed) {
            updated[i] = { ...updated[i], active: true };
            break;
          }
        }
      }
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    }
    case "activate": {
      const updated = tasks.map((task) => {
        return {
          ...task,
          active: task.id === action.id && !task.active ? true : false,
        };
      });
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    }
    case "activate_next": {
      const activeIndex = tasks.findIndex((task) => task.active);
      const startIndex = activeIndex === -1 ? 0 : activeIndex + 1;
      for (let i = startIndex; i < tasks.length; i++) {
        if (!tasks[i].completed) {
          const updated = tasks.map((task) => ({
            ...task,
            active: task.id === tasks[i].id,
          }));
          localStorage.setItem("tasks", JSON.stringify(updated));
          return updated;
        }
      }
      for (let i = 0; i < startIndex; i++) {
        if (!tasks[i].completed) {
          const updated = tasks.map((task) => ({
            ...task,
            active: task.id === tasks[i].id,
          }));
          localStorage.setItem("tasks", JSON.stringify(updated));
          return updated;
        }
      }
      return tasks;
    }
    case "delete": {
      const targetTask = tasks.find((task) => task.id === action.id);
      const activeDeleted = targetTask?.active || false;

      const updated = tasks.filter((task) => task.id !== action.id);

      if (activeDeleted && updated.length > 0) {
        updated[0] = { ...updated[0], active: true };
      }
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    }
    case "sort": {
      const { event: e } = action;
      if (!e || !e.over) return tasks;
      if (e.active.id !== e.over.id) {
        const ids = tasks.map((task) => task.id);
        const oldIndex = ids.indexOf(e.active.id as CryptoUUID);
        const newIndex = ids.indexOf(e.over.id as CryptoUUID);
        const updated = arrayMove(tasks, oldIndex, newIndex);
        localStorage.setItem("tasks", JSON.stringify(updated));
        return updated;
      }
      return tasks;
    }
    case "modify": {
      const updated = tasks.map((task) => {
        if (task.id === action.id && action.setDraftEdit) {
          action.setDraftEdit(task.name);
        }

        return {
          ...task,
          currentlyEditing: task.id === action.id ? true : false,
        };
      });

      return updated;
    }
    case "save_edit": {
      const updated = tasks.map((task) => {
        if (!action.updatedTaskName) return task;
        return {
          ...task,
          name: task.id === action.id ? action.updatedTaskName : task.name,
          currentlyEditing: false,
        };
      });
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    }
  }
}
