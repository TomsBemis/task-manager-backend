import { initialTaskTypes, initialTaskStatuses, initialTasks } from "../initialTaskData";
import { Option, TaskStatusModel, TaskTypeModel } from "../models/option.model";
import { TaskModel, Task, BasicTask } from "../models/task.model";
import { User, UserModel } from "../models/user.model";
import { UserService } from "./user.service";

export class TaskService {

    static async initializeTasks(): Promise<void> {

        // Delete tasks, their types and statuses before initializing
        await TaskModel.deleteMany({});
        await TaskTypeModel.deleteMany({});
        await TaskStatusModel.deleteMany({});
            
        // Initialize task types
        await TaskTypeModel.create(initialTaskTypes);
        let taskTypes = await TaskTypeModel.find();

        // Initialize task statuses
        await TaskStatusModel.create(initialTaskStatuses);
        let taskStatuses = await TaskStatusModel.find();

        let tasks : Task[] = [];

        let users = await UserModel.find();
        let taskUser: any = null;

        initialTasks.forEach(async initialTask => {
            taskUser = null;
            if(initialTask.assignedUser) {
                taskUser = UserService.convertToUserData(
                    users.find(
                        user => user.id == initialTask.assignedUser
                    )
                );
                taskUser.roles = taskUser.roles.map((role: Option) => role.value);
            }
            tasks.push({
                title: initialTask.title,
                description: initialTask.description,
                type: taskTypes.find( taskType => 
                    taskType.value == initialTask.type
                ) as Option,
                status: taskStatuses.find( taskStatus => 
                    taskStatus.value == initialTask.status
                ) as Option,
                assignedUser: taskUser
            });
        });

        await TaskModel.create(tasks);
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

    public async updateTask(taskId: string, taskData: any): Promise<Task | null> {

        // Validate that updated task title is unique if it is changed
        const taskTitles = (await TaskModel.find())
            .filter(task => task.id != taskId)
            .map(task => task.title);
        if (taskTitles.includes(taskData.title)) {
            throw Error("Task title must be unique");
        }

        // Validate that assigned user is null or valid user ID
        let fetchedUser: any = null;
        if(taskData.assignedUser) {
            fetchedUser = await UserModel.findById(taskData.assignedUser);
            if(!fetchedUser) throw Error("Assigned user not found");
        }
        taskData.assignedUser = UserService.convertToUserData(fetchedUser);
        taskData.assignedUser.roles = taskData.assignedUser.roles.map((role: any) => role.value);

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
