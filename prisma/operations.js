import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addTask(title, description, userMail, deadline){
      
      await addUser(userMail);
      
      const newTask = await prisma.tasks.create({
        data: {
            title: title,
            description: description,
            userMail: userMail,
            deadline: deadline,
            status: 0,
            tomatoes: 0
        }
      })
      
      return newTask;
}

async function getTasks(userMail){
    const curr = new Date();

    await addUser(userMail);

    let done = 0, missed = 0;
    // const stat = await prisma.stats.findFirst

    let tasks = await prisma.tasks.findMany({
        where: {
            userMail: userMail
        }
    })


    tasks = tasks.map(task => {return {...task, deadline: task.deadline.toString()}})
    const ret = [];

    for(const task of tasks){
        const date = new Date(task.deadline);
        const valid = date.getFullYear() >= curr.getFullYear() && date.getMonth() >= curr.getMonth() && date.getDate() >= curr.getDate();
        if(valid) ret.push(task);
        else{ 
            if(task.status === 0) missed += 1;
            else done += 1;
        }
    }
    
    await prisma.stats.update({
        where:{
            userMail: userMail
        },
        data:{
            done: done,
            missed: missed
        }
    })

    return ret;
    
}

async function deleteTask(taskId){
    console.log(taskId,"task id")
    await prisma.tasks.delete({
        where: {
            id: taskId
        }
    });
}

async function getTask(id){
    const task = await prisma.tasks.findUnique({
        where: {
            id: id
        }
    });

    return task;
}

async function increaseTomatoes(taskId){
    const task = await prisma.tasks.findUnique({
        where: {
            id: taskId
        }
    });
    
    await prisma.tasks.update({
        where: {
            id: taskId
        },
        data: {
            tomatoes: task.tomatoes + 1
        }
    });

    // increase todayStats and weeksStatus[6] by 1
    await prisma.stats.update({
        where: {
            userMail: task.userMail
        },
        data: {
            todayStats: {increment: 1},
            weekStats: {
                set: {
                    6: {increment: 1}
                }
            }
        }
    });
}

async function updateStatus(id){

    const task = await prisma.tasks.findUnique({
        where: {
            id: id
        }
    });

    if(task.status == 1) return;
    
    await prisma.tasks.update({
        where: {
            id: id
        },
        data: {
            status: 1
        }
    });

}

async function addUser(mail){

    const user = await prisma.users.findFirst({
        where: {
            email: mail
        }
    });

    if(user) return;

    await prisma.users.create({
        data:{
            email: mail,
            todayStats: 0,
            weekStats: [0,0,0,0,0,0,0]
        }
    });

    await prisma.stats.create({
        data:{
            userMail: mail,
            done: 0,
            missed: 0,
            doneToday: 0
        }
    });

}

async function getUser(mail){
    await addUser(mail);

    const user = await prisma.users.findFirst({
        where: {
            email: mail
        }
    });

    return user;
}

async function getStats(mail){
    const stat = await prisma.stats.findFirst({
        where: {
            userMail: mail
        }
    });

    return stat;
}

export {addTask, getTasks, deleteTask, getTask, increaseTomatoes, updateStatus, addUser, getUser, getStats};