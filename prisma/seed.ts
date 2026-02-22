import { TaskStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
    console.log('Seeding data...');

    const user = await prisma.user.upsert({
        where: { email: 'dummy@example.com' },
        update: {},
        create: {
            email: 'dummy@example.com',
            name: 'Dummy User',
            password: 'dummy-password',
        },
    });

    const project = await prisma.project.upsert({
        where: { slug: 'dummy-project' },
        update: {},
        create: {
            name: 'Dummy Project',
            slug: 'dummy-project',
            userId: user.id,
            createdBy: user.id,
            updatedBy: user.id,
        },
    });

    const task = await prisma.task.upsert({
        where: { slug: 'dummy-task' },
        update: {},
        create: {
            title: 'Dummy Task',
            slug: 'dummy-task',
            status: TaskStatus.TODO,
            projectId: project.id,
            createdBy: user.id,
            updatedBy: user.id,
        },
    });

    console.log('User:', user.email);
    console.log('Project:', project.name);
    console.log('Task:', task.title);

    console.log('Data seeded successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
