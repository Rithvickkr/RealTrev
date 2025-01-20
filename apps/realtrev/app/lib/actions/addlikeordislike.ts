"use server";
import prisma from "@repo/db/client";

export default async function handleReaction({ updateId, userId, type }: { updateId: number; userId: string; type: 'like' | 'dislike'; }): Promise<{ success: boolean; message: string; }> {
  try {
    // Check if the reaction already exists
    const existingReaction =
      type === 'like'
        ? await prisma.like.findUnique({
            where: { userId_updateId: { userId, updateId } },
          })
        : await prisma.dislike.findUnique({
            where: { userId_updateId: { userId, updateId } },
          });

    if (existingReaction) {
      // If the user already reacted, remove the reaction (toggle functionality)
      type === 'like'
        ? await prisma.like.delete({
            where: { userId_updateId: { userId, updateId } },
          })
        : await prisma.dislike.delete({
            where: { userId_updateId: { userId, updateId } },
          });

      return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1)} removed.` };
    }

    // Remove opposite reaction if it exists
    if (type === 'like') {
      await prisma.dislike.deleteMany({
        where: { userId, updateId },
      });
    } else {
      await prisma.like.deleteMany({
        where: { userId, updateId },
      });
    }

    // Add the new reaction
    if (type === 'like') {
      await prisma.like.create({
        data: {
          updateId,
          userId,
        },
      });
    } else {
      await prisma.dislike.create({
        data: {
          updateId,
          userId,
        },
      });
    }
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} added.`);
    return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1)} added.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred while handling the reaction.' };
  }
}
