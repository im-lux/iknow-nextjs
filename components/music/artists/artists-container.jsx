import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrowLeft, BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { spotifyApi } from "../../../api/apiConfig";
import { millisToMinutesAndSeconds } from "../../../data/convertion";
import { setIsPlaying, setTrack } from "../../../redux/playerSlice";
import ProfileMenu from "../features/profile-menu";
import Search from "../utils/search";
import ArtistsContainerItem from "./artists-container-item";

const ArtistsContainer = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState({});

  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  const { isPlaying: isPlayingState, song: songState } = useSelector(
    (store) => store.player
  );
  const dispatch = useDispatch();

  const handlePlay = (track) => {
    dispatch(setTrack(track));

    dispatch(setIsPlaying(true));

    if (track.uri === songState.uri) {
      dispatch(setIsPlaying(!isPlayingState));
    }
  };

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    if (search) {
      spotifyApi.searchArtists(search, { limit: 1 }).then((response) =>
        setArtist(
          response.body.artists.items.map((artist) => {
            return {
              id: artist.id,
              name: artist.name,
              followers: artist.followers.total,
              image: artist.images[0].url,
              genres: artist.genres.join(", "),
            };
          })[0]
        )
      );
    } else {
      spotifyApi.getMyTopArtists({ limit: 1 }).then((response) =>
        setArtist(
          response.body.items.map((artist) => {
            return {
              id: artist.id,
              name: artist.name,
              followers: artist.followers.total,
              image: artist.images[0].url,
              genres: artist.genres.join(", "),
            };
          })[0]
        )
      );
    }
  }, [accessToken, search]);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getArtistTopTracks(artist.id, "HR").then((response) =>
      setTracks(
        response.body.tracks.map((track) => {
          return {
            id: track.id,
            name: track.name,
            duration: track.duration_ms,
            explicit: track.explicit,
            image: track.album.images[1].url,
            uri: track.uri,
          };
        })
      )
    );
  }, [accessToken, artist.id]);

  useEffect(() => {
    if (!accessToken) return;

    spotifyApi
      .getArtistAlbums(artist.id, { country: "HR", limit: 3 })
      .then((response) =>
        setAlbums(
          response.body.items.map((album) => {
            return {
              id: album.id,
              name: album.name,
              image: album.images[1].url,
            };
          })
        )
      );
  }, [accessToken, artist.id]);

  const handleGoBack = () => {
    router.replace("/music/4you");
  };

  return (
    <section
      className="relative w-full h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${artist.image})` }}
    >
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-custom-dark-blue/70" />

      <div className="relative h-full z-10 flex flex-col">
        <div className="flex justify-between items-start gap-14 p-3">
          <div>
            <BsArrowLeft
              className="text-5xl cursor-pointer hover:animate-pulse"
              onClick={handleGoBack}
            />
          </div>

          <div className="flex-grow">
            <Search search={search} setSearch={setSearch} />
          </div>

          <div>
            <ProfileMenu />
          </div>
        </div>

        <div className="w-full h-full flex items-center">
          <div className="w-1/2 p-10 space-y-4 mb-36">
            <h3 className="text-lg italic opacity-80">
              {artist.followers} FOLLOWERS
            </h3>
            <h1 className="text-8xl font-bold">{artist.name}</h1>
            <p className="text-base opacity-80">{artist.genres}</p>
          </div>

          <div className="w-1/2 p-4">
            <div className="space-y-4">
              <h3 className="opacity-50 font-bold">FEATURED TRACK</h3>
              <div className="flex justify-start items-end gap-7">
                <img
                  src={tracks[0]?.image}
                  alt={tracks[0]?.name}
                  className="h-36 w-36 object-cover shadow-2xl shadow-custom-dark-blue hover:scale-105 transition duration-500 hover:shadow-custom-blue cursor-pointer"
                  onClick={handlePlay.bind(null, tracks[0])}
                />

                <div>
                  <h1
                    className="text-xl font-bold hover:underline cursor-pointer"
                    onClick={handlePlay.bind(null, tracks[0])}
                  >
                    {tracks[0]?.name}
                  </h1>
                  <p className="text-sm italic opacity-30 hover:underline inline-block cursor-pointer">
                    {artist.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 h-72">
              <h3 className="opacity-50 mb-3 font-bold">POPULAR SONGS</h3>
              <div className="w-full h-full space-y-2 overflow-y-scroll scrollbar-hide">
                {tracks.slice(1).map((track) => (
                  <ArtistsContainerItem key={track.id} track={track} />
                ))}
              </div>
            </div>

            <div className="mt-[75px] mb-20">
              <h3 className="opacity-50 mb-3 font-bold">POPULAR ALBUMS</h3>
              <div className="flex justify-start gap-5">
                {albums.map((album) => (
                  <div key={album.id}>
                    <img
                      src={album.image}
                      alt={album.name}
                      className="h-48 w-4h-48 opacity-80 rounded-xl cursor-pointer shadow-md shadow-custom-blue/10 hover:shadow-xl hover:shadow-custom-blue hover:opacity-100 hover:scale-105 transition duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsContainer;
