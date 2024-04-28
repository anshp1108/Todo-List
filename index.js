import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
import pg from 'pg'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];
const db = new pg.Client({
  user: "postgres", 
  host: "localhost",
  database: "permalist",
  password: "1107",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
async function getItems() {
  return ((await db.query('SELECT * FROM items')).rows);
}



// console.log(items);
app.get("/", async (req, res) => {
  let items=(await db.query('SELECT * FROM items ORDER BY id ASC')).rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
    ( db.query(`INSERT INTO items (title) VALUES ($1)`,[item]));
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const editeddatai=(req.body.updatedItemTitle)
  const editedid= req.body.updatedItemId
  db.query(`UPDATE items SET title= $1 WHERE id= $2`,[editeddatai,editedid])
  res.redirect("/")
});

app.post("/delete", async (req, res) => {
  const item= req.body.deleteItemId
  console.log(item);
  (db.query(`DELETE FROM items WHERE id=${item}`))
  // items= (db.query('SELECT * FROM items')).rows;
  // 
  // items= (await getItems())
  // console.log(items);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
