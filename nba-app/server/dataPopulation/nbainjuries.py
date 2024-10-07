from bs4 import BeautifulSoup
import requests
import json

url = "https://www.fantasynerds.com/nba/injuries"

page = requests.get(url)

soup = BeautifulSoup(page.text, 'html.parser')

# print(soup)

theTable = soup.find('div', class_ = 'pad')

playerInjuries = soup.find_all('tbody')

#print(playerInjuries)

players_data = []

for tbody in playerInjuries:
    rows = tbody.find_all("tr")
    for row in rows:
        # Extract player name, injury type, and injury status
        player_name = row.find("a").text.strip()
        injury_type = row.find_all("td")[1].text.strip()
        injury_status = row.find_all("td")[2].text.strip()
        
        # Create a dictionary for the player data
        player_info = {
            "player_name": player_name,
            "injury_type": injury_type,
            "injury_status": injury_status
        }
        
        # Append the player info to the list
        players_data.append(player_info)


print(players_data)

# Convert the list to JSON and save to a file
"""
with open("injury_report.json", "w") as json_file:
    json.dump(players_data, json_file, indent=4)

print("Data successfully saved to injury_report.json")
"""