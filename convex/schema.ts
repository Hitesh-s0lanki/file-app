import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    folders: defineTable({
        title: v.string(),
        files: v.array(v.object({
            name: v.string(),
            url: v.string()
        })),
    })
        .index("by_title", ["title"])
        .searchIndex("search_title", {
            searchField: "title",
            filterFields: ["title"]
        }),
})