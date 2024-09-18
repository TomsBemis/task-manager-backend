import { initialTaskTypes, initialTaskStatuses, initialTasks } from "../initialTaskData";
import { Option, TaskStatusModel, TaskTypeModel } from "../models/option.model";
import { TaskModel, Task, BasicTask } from "../models/task.model";


export class TaskService {

    static async initializeTasks(): Promise<void> {
            
        // Initialize task types
        if(!await TaskTypeModel.countDocuments()) await TaskTypeModel.create(initialTaskTypes);
        let taskTypes = await TaskTypeModel.find();

        // Initialize task statuses
        if(!await TaskStatusModel.countDocuments()) await TaskStatusModel.create(initialTaskStatuses);
        let taskStatuses = await TaskStatusModel.find();

        if(!await TaskModel.countDocuments()) {

            let tasks : Task[] = [];
            
            initialTasks.forEach(initialTask => {
                tasks.push({
                    title: initialTask.title,
                    description: initialTask.description,
                    type: taskTypes.find( taskType => 
                        taskType.value == initialTask.type
                    ) as Option,
                    status: taskStatuses.find( taskStatus => 
                        taskStatus.value == initialTask.status
                    ) as Option,
                });
            });

            await TaskModel.create(tasks);
        };
    }

    public async getEssentialTaskData() {
        const taskStatuses = await TaskStatusModel.find();  
        const taskTypes = await TaskTypeModel.find();  
        const tasks = await TaskModel.find();    
        return {
            'taskStatuses' : taskStatuses,
            'taskTypes' : taskTypes,
            'tasks' : tasks.map(task => TaskService.toBasicTask(task))
        };
    }

    public async getTasks(): Promise<BasicTask[]> {        
        const tasks = await TaskModel.find();    
        return tasks.map(task => TaskService.toBasicTask(task));
    }

    public async getTaskById(taskId: string): Promise<Task | null> {        
        return await TaskModel.findOne({ _id: taskId });
    }

    public async createTask(taskData: Task): Promise<Task | null> {
        // Validate that new task title is unique
        const taskTitles = (await TaskModel.find()).map(task => task.title);
        const newTaskTitle = taskData.title;
        if (taskTitles.includes(newTaskTitle)) throw Error("Task title must be unique");
        return await TaskModel.create(taskData);
    }

    public async updateTask(taskId: string, taskData: Task): Promise<Task | null> {

        // Validate that new task title is unique
        const taskTitles = (await TaskModel.find())
            .filter(task => task.id == taskId)
            .map(task => task.title);
        if (taskTitles.includes(taskData.title)) throw Error("Task title must be unique");

        // Update by id
        await TaskModel.updateOne(
            { _id: taskId },
            { $set: taskData }
        );

        // Fetch updated task
        return await TaskModel.findOne({ _id: taskId });
    }

    public async deleteTask(taskId: string): Promise<Task[]> {

        await TaskModel.deleteOne({ _id: taskId });
        return await TaskModel.find();
    }

    static toBasicTask(task : any): BasicTask {
        return {
            id: task.id,
            title: task.title, 
            type: {
                value: task.type.value,
                displayName: task.type.displayName
            }
        }
    }
}
