import {Webhook} from 'svix';
import {headers} from 'next/headers';
import pool from '@/lib/db';

export async function POST(req) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    try {
        const evt = wh.verify(body, {
            'svix-id': headerPayload.get('svix-id'),
            'svix-timestamp': headerPayload.get('svix-timestamp'),
            'svix-signature': headerPayload.get('svix-signature'),
        });

        switch (evt.type) {
            case 'user.created':
            case 'user.updated':
                await syncUserToDatabase(evt.data);
                break;
            case 'user.deleted':
                await deleteUserFromDatabase(evt.data.id);
                break;
        }
        return new Response(null, {status: 200});
    } catch (err) {
        return new Response('Webhook Error', {status: 400});
    }
}


// Sync a single user from Clerk to your database
async function syncUserToDatabase(clerkUser) {
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Determine user role (default to 'student' if not specified)
        const role = determineUserRole(clerkUser);

        // Upsert user in the database
        const upsertQuery = `
      INSERT INTO Users (User_ID, Fname, Lname, Role,img_url,username)
      VALUES ($1, $2, $3, $4,$5,$6)
      ON CONFLICT (User_ID) DO UPDATE
      SET Fname = $2, 
          Lname = $3, 
          Role = $4,
          img_url = $5,
          username = $6
    `;

        await client.query(upsertQuery, [clerkUser.id, clerkUser.first_name || '', clerkUser.last_name || '', role, clerkUser.image_url, clerkUser.username]);

        // Commit transaction
        await client.query('COMMIT');
    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error(`Failed to sync user ${clerkUser.id}`, error);
    } finally {
        // Release the client back to the pool
        client.release();
    }
}

// Delete user from database if deleted in Clerk
async function deleteUserFromDatabase(clerkUserId) {
    const client = await pool.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Delete user
        const deleteQuery = 'DELETE FROM Users WHERE User_ID = $1';
        await client.query(deleteQuery, [clerkUserId]);

        // Commit transaction
        await client.query('COMMIT');
    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error(`Failed to delete user ${clerkUserId}`, error);
    } finally {
        // Release the client back to the pool
        client.release();
    }
}

// Determine user role based on Clerk metadata or email
function determineUserRole(clerkUser) {

    return clerkUser.publicMetadata?.role ?? 'student'
}