import pool from "../../../../../lib/db";
import { NextResponse } from "next/server";

//get channel's info and messages given the chatgroup id and the channel number
export async function GET(request, { params }) {
  try {
    const par = await params;
    const req = await request;
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    console.log("Received Parameters: ", {
      groupid: par.groupid,
      channelnum: par.channelnum,
      startDate,
      endDate,
    });

    const channelinfo = await pool.query(
      "SELECT * FROM Channel WHERE Group_ID = $1 AND Channel_Num = $2",
      [par.groupid, par.channelnum]
    );
    if (channelinfo.rows.length === 0) {
      return NextResponse.json({ error: "channel not found" }, { status: 404 });
    }

    let channelmessages;
    if (startDate && endDate) {
      channelmessages = await pool.query(
        "SELECT * FROM Message WHERE Group_ID = $1 AND Channel_Num = $2 AND Time_Stamp >= $3 AND Time_Stamp <= $4 ORDER BY Time_Stamp DESC",
        [par.groupid, par.channelnum, startDate, endDate]
      );
      console.log("Running Date Range Query: ", {
        groupid: par.groupid,
        channelnum: par.channelnum,
        startdate: req.startDate,
        enddate: req.endDate,
      });
    } else {
      channelmessages = await pool.query(
        "SELECT * FROM Message M,users U WHERE Group_ID = $1 AND Channel_Num = $2 AND M.sender_id = U.user_id  ORDER BY Time_Stamp DESC LIMIT 50",
        [par.groupid, par.channelnum]
      );
      console.log("Running Default Query");
    }
    const resp = {
      ...channelinfo.rows[0],
      messages: channelmessages.rows.reverse(),
    };
    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    console.error("Error fetching channel:", err);
    return NextResponse.json(
      { error: "Failed to fetch channel" },
      { status: 500 }
    );
  }
}

