import pool from "@/lib/db";
import {NextResponse} from "next/server";

//get a message given its id
export async function GET(request, { params }) {
  try {
    const par = await params;
    console.log("Params:", par.messageid);
    const messageinfo = await pool.query(
      "SELECT * FROM Message WHERE Message_ID = $1",
      [par.messageid]
    );
    if (messageinfo.rows.length === 0) {
      return NextResponse.json({ error: "message not found" }, { status: 404 });
    }
    const messageattachments = await pool.query(
      "SELECT * FROM messageAttachment WHERE Message_ID = $1",
      [par.messageid]
    );
    const resp = {
      ...messageinfo.rows[0],
      attachments: messageattachments.rows,
    };
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.error("Error fetching message:", err);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}


// @TODO: Idk about this option, ill rethink it later
// // Update the content of a message
// export async function PATCH(request, { params }) {
//   try {
//     const par = await params;
//     const { content } = await request.json();
//     await pool.query("UPDATE Message SET Content = $1 WHERE Message_ID = $2", [
//       content,
//       par.messageid,
//     ]);
//     return NextResponse.json({ message: "Message updated" }, { status: 200 });
//   } catch (err) {
//     console.error("Error updating Message:", err);
//     return NextResponse.json(
//       { error: "Failed to update Message" },
//       { status: 500 }
//     );
//   }
// }
