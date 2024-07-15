export const initialTasks = [
    {"title" : "TM-2", "description" : "Setup Angular CLI", "type" : "STORY", "createdOn" : "2024-05-21", "modifiedOn" : "2024-05-21", "status": "DONE"},
    {"title" : "TM-3", "description" : "Create new application", "type" : "TASK", "createdOn" : "2024-05-22", "modifiedOn" : "2024-05-22", "status": "OBSOLETE"},
    {"title" : "TM-4", "description" : "Task List Application - Create base", "type" : "SUBTASK", "createdOn" : "2024-05-23", "modifiedOn" : "2024-05-23", "status": "FIX_IN_DEV"},
    {"title" : "TM-5", "description" : "Create a “Create task“ component with add a task functionality using Angular Reactive Forms.", "type" : "SUBTASK", "createdOn" : "2024-05-23", "modifiedOn" : "2024-05-23", "status": "IN_PROGRESS"}
];

export const initialTaskTypes = [
    {"value" : "STORY", "displayName" : "Story"},
    {"value" : "TASK", "displayName" : "Task"},
    {"value" : "SUBTASK", "displayName" : "Subtask"}
];

export const initialTaskStatuses = [
    {"value" : "IN_PROGRESS", "displayName" : "In Progress"},
    {"value" : "FIX_IN_DEV", "displayName" : "Fix in dev"},
    {"value" : "OBSOLETE", "displayName" : "Obsolete"},
    {"value" : "DONE", "displayName" : "Done"}
];