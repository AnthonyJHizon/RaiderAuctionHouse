# RaiderAuctionHouse

Link to web app: https://raider-auction-house.vercel.app/

## Local Development with Docker

Before executing the app with Docker, create a `.env.local` file in the project directory with the following contents:

```text
CLIENT_ID=...
CLIENT_SECRET=...
```

The `CLIENT_ID` and `CLIENT_SECRET` are your Blizzard client's credentials (See [Blizzard API Access](https://develop.battle.net/access/clients)). Once the `.env` file is created and populated, you may perform the following command to run the web application alongside a mongodb instance:

```
docker-compose up --build
```

Then navigate to http://localhost:3000/ on your browser.
