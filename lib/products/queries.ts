import {prisma} from '../prisma';

export async function getActiveProducts(){
    return await prisma.product.findMany({
        where: {
            status: 'ACTIVE',
        },
        include: {
            category: true,
            prices: {
                where: {
                    isActive: true,
                }
            },
            availability: true,


        },
        orderBy: {
            name: 'asc',
        }

    });

}
