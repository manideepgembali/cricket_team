const express=require("express")

const app=express()

const { open }=require("sqlite")
const sqlite3=require("sqlite3")

const path=require("path")
const dbPath=path.join(__dirname,"cricketTeam.db")
let db=null
app.use(express.json());

const initialiseDbAndServer=async()=>{
    try{
    db=await open({
        filename:dbPath
        driver:sqlite3.Database
    })
    app.listen(3000,()=>{
        console.log("Server Running at http://localhost:3000/");
    })

    }
    catch(e){
        console.log(`DB error:${e.message}`)
        process.exit(1)
    }
}
initialiseDbAndServer()

const convertDbObject = (objectItem) => {
  return {
    playerId: objectItem.player_id,
    playerName: objectItem.player_name,
    jerseyNumber: objectItem.jersey_number,
    role: objectItem.role,
  };
};


app.get("/players/",async(request,response)=>{
    const getData=`
    select * 
    from cricket_team
    `;
    const details=await db.all(getData)
    response.send(details.map(player)=>convertDbObject(player)) 
})

app.post("/players/",async(request,responce)=>{
    const details=request.body
    const {
        playerName,
        jerseyNumber,
        role
    }=details

    const addData=`
    INSERT INTO
     cricket_team(player_name,jersey_number,role)
    values(
        `${player_name}`,
        `${jersey_number}`,
        `${role}`
    )`;
    const detais1=await db.run(addData)
    console.log("Player Added to Team")

})

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  const player1 = await db.get(getPlayerQuery);
  response.send(convertDbObject(player1));
});

app.put("/players/:playerId/",async(request,responce)=>{
    const { playerId } = request.params;
    const details=request.body
    const {
        playerName,
        jerseyNumber,
        role
    }=details

    const updateData=`
    UPDATE
     cricket_team
    SET
        player_id=`${playerId}`
        player_name=`${playerName}`,
        jersey_number=`${jerseynumber}`,
        role=`${role}`
    WHERE
      player_id = ${playerId};`;
    const detais1=await db.run(updateData)
    console.log("Player Details Updated")

})

app.delete("//players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports=app;