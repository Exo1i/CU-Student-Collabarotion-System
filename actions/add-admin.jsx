'use server'
import {clerkClient} from "@clerk/nextjs/server";

export async function AddAdmin(email, password, username, firstName, lastName) {
    const clerk = await clerkClient();
    console.log('Creating admin user:', {email, password, username, firstName, lastName});
    try {
        const newUser = await clerk.users.createUser({
            emailAddress: [email],
            password: password,
            firstName: firstName,
            lastName: lastName,
            username: username,
            publicMetadata: {role: 'admin', hasOnBoarded: true},
        });
        return {status: 201, message: 'Admin user created successfully'};
    } catch (error) {
        console.error('Error creating admin user:', error);
        return {message: `Failed to create admin user,${error}`, status: 500}
    }
}

