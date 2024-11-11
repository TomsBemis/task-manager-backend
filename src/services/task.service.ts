import { initialTasks } from "../assets/initialTaskData";
import { TaskModel, Task, BasicTask } from "../models/task.model";
import { Role, User, UserModel } from "../models/user.model";
import { UserService } from "./user.service";

export class TaskService {

    static async initializeTasks(): Promise<void> {

        // Delete tasks, their types and statuses before initializing
        await TaskModel.deleteMany({});

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
            }
            tasks.push({
                title: initialTask.title,
                description: initialTask.description,
                type: initialTask.type,
                status: initialTask.status,
                assignedUser: taskUser
            });
        });

        await TaskModel.create(tasks);
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

        // Update by id
        await TaskModel.updateOne(
            { _id: taskId },
            { $set: taskData }
        );

        // Fetch updated task
        return await TaskModel.findOne({ _id: taskId });
    }

    public async validateTaskData(currentUser: User, taskId: string, taskData: any) {

        if(!currentUser.roles.includes(Role.ADMIN) && !currentUser.roles.includes(Role.MANAGER)) {
            throw Error("Only users with the roles admin or manager can update a task");
        }

        if(currentUser.roles.includes(Role.ADMIN)) {
            // Remove only assigned user from task data
            delete taskData.assignedUser;

            // Validate that updated task title is unique if it is changed
            const taskTitles = (await TaskModel.find())
                .filter(task => task.id != taskId)
                .map(task => task.title);
            if (taskTitles.includes(taskData.title)) {
                throw Error("Task title must be unique");
            }
            
        }
        else if(currentUser.roles.includes(Role.MANAGER)) {
            // Remove all task data except assigned user
            let fetchedUser: any = null;
            if(taskData.assignedUser) {
                fetchedUser = await UserModel.findById(taskData.assignedUser);
                if(!fetchedUser) throw Error("Assigned user not found");
            }
            taskData.assignedUser = UserService.convertToUserData(fetchedUser);
            taskData = {
                assignedUser: taskData.assignedUser
            }
        }
        return taskData;
    }

    public async deleteTask(taskId: string): Promise<Task[]> {

        await TaskModel.deleteOne({ _id: taskId });
        return await TaskModel.find();
    }

    static toBasicTask(task : any): BasicTask {
        return {
            id: task.id,
            title: task.title, 
            type: task.type
        }
    }
}
