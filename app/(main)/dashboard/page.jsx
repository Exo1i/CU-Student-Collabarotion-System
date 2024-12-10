import { addProject } from "@/actions/add-project";

async function test() {
  try {
    const res = await addProject(
      "Database proj",
      "CMP2020",
      "12-6-2024",
      "testing add proj",
      5,
      100
    );
    console.log(res);
  } catch (e) {
    console.log("💣", e);
  }
}
