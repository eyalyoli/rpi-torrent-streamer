import qbittorrentapi
import sys,json, attrdict

# instantiate a Client using the appropriate WebUI configuration
qbt_client = qbittorrentapi.Client(host='localhost:8080', username='admin', password='555689')

# the Client will automatically acquire/maintain a logged in state in line with any request.
# therefore, this is not necessary; however, you many want to test the provided login credentials.
try:
    qbt_client.auth_log_in()
except qbittorrentapi.LoginFailed as e:
    print(e)

# display qBittorrent info
#print(f'qBittorrent: {qbt_client.app.version}')
#print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')
#for k,v in qbt_client.app.build_info.items(): print(f'{k}: {v}')

def toJson(str):
    all=str.replace('False', 'false')
    all=all.replace('True', 'true')
    all=all.replace("'",'"')
    return all

SAVE_PATH = qbt_client.app_default_save_path()

if __name__ == "__main__":
    cmd = sys.argv[1]

    if cmd=='add':
        #print('add')
        th= sys.argv[2]
        r=qbt_client.torrents_add([th], is_sequential_download=True, is_first_last_piece_priority=True)
        print(r)

    if cmd=='remove':
        #print('remove')
        th= sys.argv[2]
        qbt_client.torrents_delete(delete_files=True,torrent_hashes=[th])
        print(toJson(str({"success":True})))

    if cmd=='list':
        #print('all')
        # retrieve and show all torrents
        all=str(qbt_client.torrents_info(SIMPLE_RESPONSES=True))
        print(toJson(all))

    if cmd=='getpath':
        #print('get')
        t= sys.argv[2]
        f=qbt_client.torrents_files(t)
        #print(f)

        size = 0
        for file in f:
            if file['size'] > size:
                size = file['size']
                biggest_file = file

        r=SAVE_PATH+biggest_file['name']
        print(toJson(str({"path":r})))