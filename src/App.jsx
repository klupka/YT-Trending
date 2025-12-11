import axios from "axios";
import { useState, useEffect, useRef } from "react";

// NPM Packages
import NumericLabel from "react-pretty-numbers";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { FastAverageColor } from "fast-average-color";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
// import "rc-dropdown/assets/index.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDownShortWide,
    faArrowDownWideShort,
    faArrowUpShortWide,
    faBug,
    faCaretDown,
    faEarthAmericas,
    faExclamation,
    faListOl,
    faMagnifyingGlass,
    faSpinner,
    faFire,
    faSquareArrowUpRight,
    faMusic,
    faXmark,
    faGamepad,
    faFilm,
    faCar,
    faPaw,
    faFootball,
    faVideo,
    faPeopleGroup,
    faFaceLaugh,
    faSmile,
    faNewspaper,
    faHandshakeAngle,
    faBook,
    faMicrochip,
    faSeedling,
} from "@fortawesome/free-solid-svg-icons";

function App() {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    const [videoData, setVideoData] = useState(null);
    // const [videoCategories, setVideoCategories] = useState(null);
    const [regionCode, setRegionCode] = useState("US");
    const [averageColorThumbnails, setAverageColorThumbnails] = useState([]);
    const [allLoaded, setAllLoaded] = useState(false);
    const [selectedRegionValue, setSelectedRegionValue] = useState("US");
    const [maxVideoResults, setMaxVideoResults] = useState(25);
    const [selectedMaxVideoResults, setSelectedMaxVideoResults] = useState(25);
    const [timeStart, setTimeStart] = useState(null);
    const [timeEnd, setTimeEnd] = useState(null);
    const [ascendingFeed, setAscendingFeed] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    const submitOptions = () => {
        console.log("FINDING VIDEOS");
        // e.preventDefault(); // prevent page reload
        setRegionCode(selectedRegionValue);
        setMaxVideoResults(selectedMaxVideoResults);
    };

    async function fetchVideoData() {
        try {
            const response = await axios.get(
                `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=${maxVideoResults}&regionCode=${regionCode}&key=${API_KEY}`
            );
            console.log("Video Data:", response.data.items);
            setVideoData(response.data.items);
            setErrorMsg(null);
        } catch (error) {
            console.error("Error fetching video data:", error);
            setVideoData(null);
            setErrorMsg(error.message);
            setAllLoaded(true);
        }
    }

    // async function fetchVideoCategories() {
    //     try {
    //         const response = await axios.get(
    //             `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=${regionCode}&key=${API_KEY}`
    //         );
    //         console.log("Video Category Data:", response.data.items);
    //         setVideoCategories(response.data.items);
    //     } catch (error) {
    //         console.error("Error fetching video category data:", error);
    //         setVideoCategories(null);
    //     }
    // }

    const getThumbnailColors = () => {
        const fac = new FastAverageColor();
        videoData.map((video) => {
            fac.getColorAsync(video.snippet.thumbnails.default.url)
                .then((color) => {
                    // console.log(
                    //     `Video #${videoData.indexOf(
                    //         video
                    //     )} | Thumbnail Color: ${color.rgba}`
                    // );
                    let formattedColor = color.rgba.slice(0, -2);
                    formattedColor = formattedColor + "0.35)";
                    setAverageColorThumbnails((prev) => [
                        ...prev,
                        [videoData.indexOf(video), formattedColor],
                    ]);
                    // console.log(averageColorThumbnails);
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    };

    useEffect(() => {
        TimeAgo.addDefaultLocale(en);
    }, []);

    useEffect(() => {
        console.log("allLoaded:", allLoaded);
        console.log("errorMsg:", errorMsg);
    }, [allLoaded]);

    useEffect(() => {
        setAllLoaded(false);
        setErrorMsg(null);
        setTimeStart(performance.now() / 1000);
        fetchVideoData();
        // fetchVideoCategories();
    }, [regionCode, maxVideoResults]);

    useEffect(() => {
        if (videoData) getThumbnailColors();
    }, [videoData]);

    let sortedThumbnails = [];

    useEffect(() => {
        if (
            videoData !== null &&
            averageColorThumbnails.length === videoData.length
        ) {
            sortedThumbnails = averageColorThumbnails.sort(
                (a, b) => a[0] - b[0]
            );
            setAverageColorThumbnails(sortedThumbnails);
            console.log(
                "Updated averageColorThumbnails:",
                averageColorThumbnails
            );
            setTimeEnd(performance.now() / 1000);
            setAllLoaded(true);
        }
    }, [averageColorThumbnails, regionCode, maxVideoResults]);

    useEffect(() => {
        setAllLoaded(false);
        console.log("Removing old thumbnail colors.");
        setAverageColorThumbnails([]);
        console.log("Removing old video data.");
        setVideoData(null);
    }, [regionCode, maxVideoResults]);

    let paramsThousandsAndBelow = {
        shortFormat: true,
        shortFormatMinValue: 1000,
        shortFormatPrecision: 0,
        commafy: false,
    };

    let paramsMillionsAndAbove = {
        shortFormat: true,
        shortFormatMinValue: 1000,
        shortFormatPrecision: 1,
        commafy: false,
    };

    const regions = {
        DZ: "Algeria",
        AR: "Argentina",
        AU: "Australia",
        AT: "Austria",
        AZ: "Azerbaijan",
        BH: "Bahrain",
        BD: "Bangladesh",
        BY: "Belarus",
        BE: "Belgium",
        BO: "Bolivia",
        BA: "Bosnia and Herzegovina",
        BR: "Brazil",
        BG: "Bulgaria",
        KH: "Cambodia",
        CA: "Canada",
        CL: "Chile",
        CO: "Colombia",
        CR: "Costa Rica",
        HR: "Croatia",
        CY: "Cyprus",
        CZ: "Czechia",
        DK: "Denmark",
        DO: "Dominican Republic",
        EC: "Ecuador",
        EG: "Egypt",
        SV: "El Salvador",
        EE: "Estonia",
        FI: "Finland",
        FR: "France",
        GE: "Georgia",
        DE: "Germany",
        GH: "Ghana",
        GR: "Greece",
        GT: "Guatemala",
        HN: "Honduras",
        HK: "Hong Kong",
        HU: "Hungary",
        IS: "Iceland",
        IN: "India",
        ID: "Indonesia",
        IQ: "Iraq",
        IE: "Ireland",
        IL: "Israel",
        IT: "Italy",
        JM: "Jamaica",
        JP: "Japan",
        JO: "Jordan",
        KZ: "Kazakhstan",
        KE: "Kenya",
        KW: "Kuwait",
        LA: "Laos",
        LV: "Latvia",
        LB: "Lebanon",
        LY: "Libya",
        LI: "Liechtenstein",
        LT: "Lithuania",
        LU: "Luxembourg",
        MY: "Malaysia",
        MT: "Malta",
        MX: "Mexico",
        ME: "Montenegro",
        MA: "Morocco",
        NP: "Nepal",
        NL: "Netherlands",
        NZ: "New Zealand",
        NI: "Nicaragua",
        NG: "Nigeria",
        MK: "North Macedonia",
        NO: "Norway",
        OM: "Oman",
        PK: "Pakistan",
        PA: "Panama",
        PG: "Papua New Guinea",
        PY: "Paraguay",
        PE: "Peru",
        PH: "Philippines",
        PL: "Poland",
        PT: "Portugal",
        PR: "Puerto Rico",
        QA: "Qatar",
        RO: "Romania",
        RU: "Russia",
        SA: "Saudi Arabia",
        SN: "Senegal",
        RS: "Serbia",
        SG: "Singapore",
        SK: "Slovakia",
        SI: "Slovenia",
        ZA: "South Africa",
        KR: "South Korea",
        ES: "Spain",
        LK: "Sri Lanka",
        SE: "Sweden",
        CH: "Switzerland",
        TW: "Taiwan",
        TZ: "Tanzania",
        TH: "Thailand",
        TN: "Tunisia",
        TR: "Turkey",
        UG: "Uganda",
        UA: "Ukraine",
        AE: "United Arab Emirates",
        GB: "United Kingdom",
        US: "United States",
        UY: "Uruguay",
        VE: "Venezuela",
        VN: "Vietnam",
        YE: "Yemen",
        ZW: "Zimbabwe",
    };

    const videoCategories = {
        1: "Film & Animation",
        2: "Autos & Vehicles",
        10: "Music",
        15: "Pets & Animals",
        17: "Sports",
        18: "Short Movies",
        19: "Travel & Events",
        20: "Gaming",
        21: "Videoblogging",
        22: "People & Blogs",
        23: "Comedy",
        24: "Entertainment",
        25: "News & Politics",
        26: "Howto & Style",
        27: "Education",
        28: "Science & Technology",
        29: "Nonprofits & Activism",
        30: "Movies",
        31: "Anime/Animation",
        32: "Action/Adventure",
        33: "Classics",
        34: "Comedy",
        35: "Documentary",
        36: "Drama",
        37: "Family",
        38: "Foreign",
        39: "Horror",
        40: "Sci-Fi/Fantasy",
        41: "Thriller",
        42: "Shorts",
        43: "Shows",
        44: "Trailers",
    };

    const videoCategoryIcons = {
        1: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        2: <FontAwesomeIcon icon={faCar} className="text-xs" />,
        10: <FontAwesomeIcon icon={faMusic} className="text-xs" />,
        15: <FontAwesomeIcon icon={faPaw} className="text-xs" />,
        17: <FontAwesomeIcon icon={faFootball} className="text-xs" />,
        18: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        19: <FontAwesomeIcon icon={faEarthAmericas} className="text-xs" />,
        20: <FontAwesomeIcon icon={faGamepad} className="text-xs" />,
        21: <FontAwesomeIcon icon={faVideo} className="text-xs" />,
        22: <FontAwesomeIcon icon={faPeopleGroup} className="text-xs" />,
        23: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        24: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        25: <FontAwesomeIcon icon={faNewspaper} className="text-xs" />,
        26: <FontAwesomeIcon icon={faHandshakeAngle} className="text-xs" />,
        27: <FontAwesomeIcon icon={faBook} className="text-xs" />,
        28: <FontAwesomeIcon icon={faMicrochip} className="text-xs" />,
        29: <FontAwesomeIcon icon={faSeedling} className="text-xs" />,
        30: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        31: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        32: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        33: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        34: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        35: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        36: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        37: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        38: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        39: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        40: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        41: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        42: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        43: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
        44: <FontAwesomeIcon icon={faFilm} className="text-xs" />,
    };

    const menuStyle = {
        // width: 200,
        height: 400,
        overflow: "auto",
    };

    const handleRegionMenuSelect = ({ key }) => {
        const label = regions[key];
        console.log(`Key: ${key}, Label: ${label}`);
        setSelectedRegionValue(key);
        setRegionCode(key);
    };

    const handleMaxVideoResultsMenuSelect = ({ key }) => {
        setSelectedMaxVideoResults(key);
        setMaxVideoResults(key);
    };

    const regionSelectMenu = (
        <Menu
            className={`bg-[#121212]/60 backdrop-blur-2xl border-2 text-[#f1f1f1] border-[#aaaaaa]/10 [&>*]:px-4 rounded-lg overflow-hidden`}
            style={menuStyle}
            onSelect={handleRegionMenuSelect}
        >
            <MenuItem disabled className="py-2">
                Choose a Region
            </MenuItem>
            <Divider className="bg-[#aaaaaa]/10 h-[2px] mb-1" />
            {Object.keys(regions).map((key) => (
                <MenuItem
                    key={key}
                    className={`py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 ${
                        key === selectedRegionValue
                            ? "bg-blue-500 hover:bg-blue-500"
                            : ""
                    }`}
                >
                    {regions[key]}
                </MenuItem>
            ))}
        </Menu>
    );

    useEffect(() => {
        if (videoData) setVideoData(videoData.reverse());
        if (averageColorThumbnails)
            setAverageColorThumbnails(averageColorThumbnails.reverse());
    }, [ascendingFeed]);

    const maxVideoResultsSelectMenu = (
        <Menu
            className={`bg-[#121212]/60 backdrop-blur-2xl border-2 text-[#f1f1f1] border-[#aaaaaa]/10 [&>*]:px-4 rounded-lg overflow-hidden`}
            // style={menuStyle}
            onSelect={handleMaxVideoResultsMenuSelect}
        >
            <MenuItem disabled className="py-2">
                Results
            </MenuItem>
            <Divider className="bg-[#aaaaaa]/10 h-[2px] mb-1" />
            <MenuItem
                key="10"
                className={`py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 ${
                    "10" == selectedMaxVideoResults
                        ? "bg-blue-500 hover:bg-blue-500"
                        : ""
                }`}
            >
                10
            </MenuItem>
            <MenuItem
                key="25"
                className={`py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 ${
                    "25" == selectedMaxVideoResults
                        ? "bg-blue-500 hover:bg-blue-500"
                        : ""
                }`}
            >
                25
            </MenuItem>
            <MenuItem
                key="50"
                className={`py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 ${
                    "50" == selectedMaxVideoResults
                        ? "bg-blue-500 hover:bg-blue-500"
                        : ""
                }`}
            >
                50
            </MenuItem>
        </Menu>
    );

    const formatTimeCode = (hours, minutes, seconds) => {
        // Pad seconds with leading zero if needed
        const sec = seconds.toString().padStart(2, "0");
        const min =
            hours > 0
                ? minutes.toString().padStart(2, "0")
                : minutes.toString();

        return hours > 0
            ? `${hours}:${min}:${sec}` // Include hours if > 0
            : `${min}:${sec}`; // Otherwise just mm:ss
    };

    const getVideoDuration = (timeCode) => {
        // example timeCode: PT2H7M14S
        let editedString;

        // remove 'PT', aka period time
        editedString = timeCode.slice(2);

        // stop characters: H, M, S = hours, minutes, seconds
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        let indexOfH = editedString.indexOf("H");
        let indexOfM = editedString.indexOf("M");
        let indexOfS = editedString.indexOf("S");

        if (indexOfH >= 0) {
            hours = editedString.slice(0, indexOfH);
            editedString = editedString.slice(indexOfH + 1);
        }

        if (indexOfM >= 0) {
            indexOfM = editedString.indexOf("M");
            minutes = editedString.slice(0, indexOfM);
            editedString = editedString.slice(indexOfM + 1);
        }

        if (indexOfS >= 0) {
            indexOfS = editedString.indexOf("S");
            seconds = editedString.slice(0, indexOfS);
            editedString = editedString.slice(indexOfS + 1);
        }

        return formatTimeCode(hours, minutes, seconds);
    };

    let dynamicPageContent;

    if (allLoaded === false && errorMsg === null) {
        dynamicPageContent = (
            <div className="text-[#f1f1f1] w-full flex flex-col gap-2 justify-center h-screen items-center animate-pulse">
                <div className="animate-spin w-10 h-10 flex justify-center items-center">
                    <FontAwesomeIcon icon={faSpinner} className="text-2xl" />
                </div>
                Retrieving results…
            </div>
        );
    } else if (allLoaded === true && errorMsg !== null) {
        dynamicPageContent = (
            <div className="text-[#f1f1f1] w-full flex flex-col gap-2 justify-center h-screen items-center">
                <div className="w-10 h-10 flex justify-center items-center">
                    <FontAwesomeIcon
                        icon={faExclamation}
                        className="text-2xl"
                    />
                </div>
                {errorMsg}
                <div className="italic text-[#aaaaaa]">
                    Trending data for {regions[regionCode]} may not be
                    available.
                </div>
            </div>
        );
    } else if (allLoaded === true && errorMsg === null) {
        dynamicPageContent = (
            <div className="md:px-3.5 md:mt-5 mt-0">
                <div className="flex flex-col md:gap-0 gap-5">
                    {/* ******** arr.reverse.map is a thing. just add
                            parenthesis after reverse since its a function
                            ************ */}
                    {videoData == null
                        ? "Yes, null"
                        : videoData.map((item, index) => (
                              <div
                                  key={index}
                                  className="flex md:h-[200px] max-w-[1200px] gap-4 mx-auto group w-full"
                              >
                                  {/* ITEM 1: RANK */}
                                  <div
                                      className={` max-w-[15px] w-full items-center justify-center md:flex hidden`}
                                  >
                                      <div
                                          // border-2 bg-[#121212]
                                          className={` h-6 w-6 flex justify-center opacity-50 rounded-full text-sm font-semibold border-[#212121]
                                             ${
                                                 videoData.indexOf(item) + 1 ==
                                                 1
                                                     ? "" //bg-amber-300 text-[#0f0f0f] | shadow-[0px_0px_15px_rgba(241,241,241,0.9)]
                                                     : ""
                                             }
                                          ${
                                              videoData.indexOf(item) + 1 == 2
                                                  ? "" //bg-gray-200 text-[#0f0f0f]
                                                  : ""
                                          }
                                          ${
                                              videoData.indexOf(item) + 1 == 3
                                                  ? "" //bg-amber-600 text-[#0f0f0f]
                                                  : ""
                                          }
                                          ${
                                              videoData.indexOf(item) + 1 //> 3
                                                  ? "text-[#f1f1f1]"
                                                  : ""
                                          }
                                          `}
                                      >
                                          <div
                                              className="w-6 h-6 text-center leading-[1.2rem]" /*italic*/
                                          >
                                              {videoData.indexOf(item) + 1}
                                          </div>
                                      </div>
                                  </div>
                                  {/* ITEM 2: VIDEO IMG + DETAILS */}
                                  <div
                                      className="flex flex-col md:flex-row gap-4 p-[10px] w-full transition-all duration-100 rounded-[20px] hover:scale-101" //hover:scale-101 rounded-[0.65rem]
                                      onMouseEnter={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                              averageColorThumbnails[
                                                  videoData.indexOf(item)
                                              ][1])
                                      }
                                      onMouseLeave={(e) =>
                                          (e.currentTarget.style.backgroundColor = `transparent`)
                                      }
                                  >
                                      <div className="text-[#f1f1f1]/50 italic text-xs md:hidden -mb-2">
                                          #{videoData.indexOf(item) + 1} ON
                                          TRENDING
                                      </div>
                                      {/* SUBITEM 1: IMAGE */}
                                      <a
                                          href={`https://www.youtube.com/watch?v=${item.id}`}
                                          target="_blank"
                                          className="aspect-video relative"
                                      >
                                          <div
                                              className="absolute bottom-2 right-2 z-10 py-0.5 px-1 bg-black/70 text-white flex justify-center items-center text-sm rounded-sm" /*rounded-sm */
                                          >
                                              <div className="leading-3 pb-[.18rem]">
                                                  {getVideoDuration(
                                                      item.contentDetails
                                                          .duration
                                                  )}
                                              </div>
                                          </div>
                                          <img
                                              src={
                                                  item.snippet.thumbnails.medium
                                                      .url
                                              }
                                              className={`aspect-video object-cover h-full transition-all duration-100 -z-10 rounded-[10px]`} //rgba(241,241,241,0.2) ${averageColorThumbnails[videoData.indexOf(item)][1]} rounded-lg
                                          />
                                      </a>
                                      {/* SUBITEM 2: VIDEO DETAILS */}
                                      <div className={`flex flex-col w-full`}>
                                          <a
                                              className="w-full"
                                              href={`https://www.youtube.com/watch?v=${item.id}`}
                                              target="_blank"
                                          >
                                              <div className="text-[#f1f1f1] text-[1.15rem] md:text-[1.35rem] line-clamp-2 w-full">
                                                  {item.snippet.title}
                                              </div>
                                              <div className="flex gap-2 text-[#aaaaaa] w-full items-center mt-1">
                                                  <div className="truncate max-w-[45%]">
                                                      {
                                                          item.snippet
                                                              .channelTitle
                                                      }
                                                  </div>
                                                  <div className="text-xs">
                                                      •
                                                  </div>
                                                  <div className="flex w-fit">
                                                      <NumericLabel
                                                          //paramsThousandsAndBelow paramsMillionsAndAbove
                                                          params={
                                                              item.statistics
                                                                  .viewCount >
                                                              1000000
                                                                  ? paramsMillionsAndAbove
                                                                  : paramsThousandsAndBelow
                                                          }
                                                      >
                                                          {
                                                              item.statistics
                                                                  .viewCount
                                                          }
                                                      </NumericLabel>
                                                      <span>&nbsp;views</span>
                                                  </div>
                                                  <div className="text-xs">
                                                      •
                                                  </div>
                                                  <div className="w-fit">
                                                      <ReactTimeAgo
                                                          date={
                                                              new Date(
                                                                  item.snippet.publishedAt
                                                              )
                                                          }
                                                      />
                                                  </div>
                                              </div>
                                              <div className="h-fit flex flex-col">
                                                  <div className="line-clamp-2 text-[#aaaaaa]/60 mt-2 break-all wrap-anywhere w-full text-sm">
                                                      {item.snippet.description}
                                                  </div>
                                                  {/* HERE */}
                                                  <div className="text-white/50 flex gap-1 bg-[#aaaaaa]/10 rounded-[5px] w-fit p-0.5 items-center justify-center mt-2">
                                                      <div className="flex justify-center items-center h-5 w-5">
                                                          {
                                                              videoCategoryIcons[
                                                                  item.snippet
                                                                      .categoryId
                                                              ]
                                                          }
                                                      </div>
                                                      <div className="text-xs pr-1 flex justify-center items-center">
                                                          {
                                                              videoCategories[
                                                                  item.snippet
                                                                      .categoryId
                                                              ]
                                                          }
                                                      </div>
                                                  </div>
                                              </div>
                                          </a>
                                      </div>
                                  </div>
                                  {/* Empty space on right side for balance */}
                                  <div
                                      className={`hidden md:flex max-w-[15px] w-full items-center justify-center`}
                                  ></div>
                              </div>
                          ))}
                    <div className="text-[#aaaaaa]/50 my-10 text-xs italic w-full flex justify-center items-center text-center">
                        Showing 1-{maxVideoResults} results for{" "}
                        {regions[regionCode]}. Request took{" "}
                        {(timeEnd - timeStart).toFixed(3)}
                        &nbsp;seconds.
                    </div>
                </div>
            </div>
        );
    }

    // if (allLoaded === true) {
    return (
        <div className="bg-[#0f0f0f]">
            <div className="max-w-[1150px] mx-auto px-2">
                <div className="text-[#f1f1f1] w-full flex flex-col md:gap-0 gap-4 md:flex-row justify-between pt-10 pb-5 items-center">
                    <div className="flex gap-5 items-center justify-center md:justify-start w-full">
                        <div className="animated-gradient h-15 w-15 flex items-center rounded-full justify-center">
                            <FontAwesomeIcon
                                icon={faFire}
                                className="text-4xl drop-shadow-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[2.5rem] font-semibold flex items-center leading-none">
                                yt-trending
                            </span>
                            <span className="text-xs flex items-center opacity-50">
                                <span>Powered by the&nbsp;</span>
                                <a
                                    target="_blank"
                                    href="https://developers.google.com/youtube/v3"
                                    className="hover:underline underline-offset-2"
                                >
                                    YouTube Data API{" "}
                                    <span className="underline underline-offset-0">
                                        ↗
                                    </span>
                                </a>
                            </span>
                        </div>
                    </div>
                    {/* options */}
                    <div className="text-[#f1f1f1] text-lg flex justify-between gap-0 h-fit">
                        <div
                            className="flex gap-1 w-full rounded-l-xl items-center" /*border-r-2 border-[#aaaaaa]/10 bg-[#121212]*/
                        >
                            <div
                                className="flex items-center pl-1 py-1 pr-1 h-full" /*border-r-2 border-[#aaaaaa]/10 */
                            >
                                <Dropdown
                                    trigger={["click"]}
                                    overlay={regionSelectMenu}
                                >
                                    <button className="transition-all pr-2 py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 pl-2 rounded-lg focus:bg-[#aaaaaa]/20 bg-[#aaaaaa]/10 text-left w-50">
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon
                                                    icon={faEarthAmericas}
                                                    className="text-md"
                                                />
                                                <div className="text-[1rem] truncate">
                                                    {
                                                        regions[
                                                            selectedRegionValue
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                            <FontAwesomeIcon
                                                icon={faCaretDown}
                                                className="text-sm"
                                            />
                                        </div>
                                    </button>
                                </Dropdown>
                            </div>
                            <div
                                className="flex items-center py-1 pr-1 h-full" /*border-r-2 border-[#aaaaaa]/10 */
                            >
                                <Dropdown
                                    trigger={["click"]}
                                    // animation="slide-up"
                                    overlay={maxVideoResultsSelectMenu}
                                >
                                    <button className="transition-all pr-2 py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 pl-3 rounded-lg focus:bg-[#aaaaaa]/20 bg-[#aaaaaa]/10 text-left w-25">
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon icon={faListOl} />
                                            <div className="flex justify-between items-center w-full">
                                                <div className="text-[1rem]">
                                                    {selectedMaxVideoResults}
                                                </div>
                                                <FontAwesomeIcon
                                                    icon={faCaretDown}
                                                    className="text-sm"
                                                />
                                            </div>
                                        </div>
                                    </button>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                {dynamicPageContent}
                <footer className="w-full flex justify-between text-[#aaaaaa]/50 pt-2 pb-15 text-xs">
                    <div className="md:flex-row flex flex-col">
                        <p>© 2025 All rights reserved.&nbsp;</p>
                        <p>Not affiliated with Google or YouTube.</p>
                    </div>
                    <div className="flex">
                        <p>Built by&nbsp;</p>
                        <a
                            href="https://github.com/klupka"
                            className="hover:text-[#fc0033]/40"
                        >
                            @klupka
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
