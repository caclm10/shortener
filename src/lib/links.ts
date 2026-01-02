import { supabase } from "@/lib/supabase";

const TABLE_NAME = "links";

// Generate random alias
function generateAlias(length = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Fetch all links for current user
async function getLinks(): Promise<LinkTable[]> {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

// Fetch single link by ID
async function getLinkById(id: string): Promise<LinkTable | null> {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

// Create a new link
interface CreateLinkData {
    original_url: string;
    alias?: string;
}

async function createLink(linkData: CreateLinkData): Promise<LinkTable> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    const alias = linkData.alias || generateAlias();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert({
            user_id: user.id,
            original_url: linkData.original_url,
            alias,
            visit_count: 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Update a link
interface UpdateLinkData {
    original_url?: string;
    alias?: string;
}

async function updateLink(
    id: string,
    linkData: UpdateLinkData,
): Promise<LinkTable> {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
            ...linkData,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Delete a link
async function deleteLink(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) throw error;
}

// Check if alias is available
async function isAliasAvailable(
    alias: string,
    excludeId?: string,
): Promise<boolean> {
    let query = supabase.from(TABLE_NAME).select("id").eq("alias", alias);

    if (excludeId) {
        query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return !data || data.length === 0;
}

export {
    createLink,
    deleteLink,
    generateAlias,
    getLinkById,
    getLinks,
    isAliasAvailable,
    updateLink,
};
