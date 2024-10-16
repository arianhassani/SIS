from bs4 import BeautifulSoup
import requests
import json

def getInjuries():

    url = "https://www.fantasynerds.com/nba/injuries"

    page = requests.get(url)

    soup = BeautifulSoup(page.text, 'html.parser')

    # print(soup)

    playerInjuries = soup.findAll('div', class_ = 'col-md-10 col-sm-9 col-8')

    #print(playerInjuries)

    players_data = []

    for div in playerInjuries:
        team = div.find('h4', class_ = 'passion').text.strip()
        playerTeam = team.replace(' Injuries', '')
        tableRows = div.find('tbody')
        rows = tableRows.find_all("tr")
        for row in rows:
            # Extract player name, injury type, and injury status
            player_name = row.find("a").text.strip()
            injury_type = row.find_all("td")[1].text.strip()
            injury_status = row.find_all("td")[2].text.strip()
            
            # Create a dictionary for the player data
            player_info = {
                "player_name": player_name,
                "injury_type": injury_type,
                "injury_status": injury_status,
                "player_team": playerTeam
            }
            
            # Append the player info to the list
            players_data.append(player_info)

            # Print JSON object
            #print(players_data_json) 

            #print(players_data)
    
    # Convert Python to JSON  
    players_data_json = json.dumps(players_data, indent = 4)
    print(players_data_json)

getInjuries()

# Convert the list to JSON and save to a file
