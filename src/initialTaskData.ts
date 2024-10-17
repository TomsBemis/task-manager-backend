export const initialTasks = [
    {"title" : "TM-2", "description" : "Setup Angular CLI", "type" : "story", "status": "done", "assignedUser": "66b34f4f46a0bb66b0a7fb2b"},
    {"title" : "TM-3", "description" : "Create new application", "type" : "task", "status": "obsolete", "assignedUser": "66ed41d27822146baf0336b1"},
    {"title" : "TM-4", "description" : "Task List Application - Create base", "type" : "subtask", "status": "fixInDev", "assignedUser": null},
    {"title" : "TM-5", "description" : "Create a “Create task“ component with add a task functionality using Angular Reactive Forms.", "type" : "subtask", "status": "inProgress", "assignedUser": "66ed41d27822146baf0336af"}
];

export const initialTaskTypes = [
    {"value" : "story", "displayName" : "Story"},
    {"value" : "task", "displayName" : "Task"},
    {"value" : "subtask", "displayName" : "Subtask"}
];

export const initialTaskStatuses = [
    {"value" : "inProgress", "displayName" : "In Progress"},
    {"value" : "fixInDev", "displayName" : "Fix in dev"},
    {"value" : "obsolete", "displayName" : "Obsolete"},
    {"value" : "done", "displayName" : "Done"}
];