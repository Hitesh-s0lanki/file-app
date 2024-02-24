import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const getFilesUrl = mutation({
    args: {
        ids: v.array(v.id("_storage"))
    },
    handler: async (ctx, args) => {
        const ans: string[] = []

        for (const id of args.ids) {
            const url = await ctx.storage.getUrl(id)

            if (url) {
                ans.push(url)
            }
        }

        return ans
    }
})


export const getFileUrl = mutation({
    args: {
        id: v.id("_storage")
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.id)
    }
})

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveStorageId = mutation({
    args: {
        id: v.id("folders"),
        storageIds: v.array(
            v.object({
                name: v.string(),
                url: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {

        const folder = await ctx.db.get(args.id)

        if (!folder) throw new Error("unauthoried")

        await ctx.db.patch(args.id, {
            files: [...folder.files, ...args.storageIds.map((values) => values)]
        });
    }
});

export const deleteFile = mutation({
    args: {
        folderId: v.id("folders"),
        id: v.id("_storage")
    },
    handler: async (ctx, args) => {

        const folder = await ctx.db.get(args.folderId)

        if (!folder) throw new Error("unauthoried")

        await ctx.db.patch(args.folderId, {
            files: folder.files.filter((file) => file.url !== args.id)
        });

        await ctx.storage.delete(args.id)
    }
})
