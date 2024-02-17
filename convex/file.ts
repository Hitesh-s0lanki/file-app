import { v } from 'convex/values';
import { mutation, query } from './_generated/server';


export const create = mutation({
    args: {
        title: v.string()
    },
    handler: async (ctx, args) => {

        const folder = await ctx.db.insert("folders", {
            title: args.title,
            files: []
        })

        return folder
    }
})

export const update = mutation({
    args: { id: v.id("folders"), title: v.string() },
    handler: async (ctx, args) => {

        const title = args.title.trim()

        if (!title) {
            throw new Error("Title is required")
        }

        if (title.length > 60) {
            throw new Error("Title cannot be longer than 60 characters")
        }

        const board = await ctx.db.patch(args.id, {
            title: args.title
        })

        return board

    }
})

export const get = query({
    args: { id: v.id("folders") },
    handler: async (ctx, args) => {
        const folder = ctx.db.get(args.id)

        return folder
    }
})

export const remove = mutation({
    args: { id: v.id("folders") },
    handler: async (ctx, args) => {

        const folder = await ctx.db.get(args.id)

        if (!folder) throw new Error("unauthoried")

        folder.files.map(async (file) => await ctx.storage.delete(file.url))


        await ctx.db.delete(args.id)
    }
})

export const listFolders = query({
    handler: async (ctx) => {
        const folders = await ctx.db.query("folders").collect();

        return folders
    },
});

