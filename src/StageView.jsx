import React, { useEffect, useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCog,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

import NumericLabel from "react-pretty-numbers";
import ReactTimeAgo from "react-time-ago";

// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/css";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

const StageView = ({
    videoData,
    getVideoDuration,
    averageColorThumbnails,
    setIsStageView,
    isStageView,
    stageViewOptions,
    setStageViewOptions,
    videoCategoryIcons,
    videoCategories,
}) => {
    const getHighestQualityThumbnail = (video) => {
        const t = video?.snippet?.thumbnails;
        if (!t) return null;

        if (t.maxres && t.maxres.url) return t.maxres.url;
        if (t.standard && t.standard.url) return t.standard.url;
        if (t.high && t.high.url) return t.high.url;
        if (t.medium && t.medium.url) return t.medium.url;
        if (t.default && t.default.url) return t.default.url;

        return null;
    };

    const [showStageViewSettings, setShowStageViewSettings] = useState(false);
    const stageViewSettingsMenuRef = useRef(null);
    const stageViewSettingsBtnRef = useRef(null);

    const closeOpenStageViewSettingsMenu = (e) => {
        if (
            stageViewSettingsBtnRef.current &&
            stageViewSettingsBtnRef.current.contains(e.target)
        ) {
            return; // ignore
        }
        if (
            showStageViewSettings &&
            !stageViewSettingsMenuRef.current?.contains(e.target)
        ) {
            setShowStageViewSettings(false);
        }
    };

    document.addEventListener("mousedown", closeOpenStageViewSettingsMenu);

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

    return (
        <div className={`transition-all ${isStageView ? "fade-in" : ""}`}>
            <div className="fixed top-1 right-1 p-2 z-10 flex justify-center items-center gap-8">
                <button
                    onClick={() => {
                        setIsStageView(false);
                    }}
                    className="hover:text-[#f1f1f1] text-[#f1f1f1]/50 transition-all hover:cursor-pointer "
                >
                    <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                </button>
            </div>
            <div className="fixed bottom-4 right-4 p-2 z-10 flex justify-center items-center gap-8">
                <div
                    ref={stageViewSettingsBtnRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowStageViewSettings((prev) => !prev);
                    }}
                    className={`hover:text-[#f1f1f1] transition-all hover:cursor-pointer ${showStageViewSettings ? "text-[#f1f1f1]" : "text-[#f1f1f1]/50"}`}
                >
                    <FontAwesomeIcon icon={faCog} className="text-2xl" />
                </div>
                {showStageViewSettings ? (
                    <div
                        ref={stageViewSettingsMenuRef}
                        className="absolute bottom-8 right-8 m-1 bg-[#121212]/60 backdrop-blur-2xl border-2 text-[#f1f1f1] border-[#aaaaaa]/10 [&>*]:px-4 rounded-lg overflow-hidden w-[275px]"
                    >
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5 mt-1"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showTitle: !stageViewOptions.showTitle,
                                }))
                            }
                        >
                            <p className="text-lg select-none">Title</p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showTitle
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showChannelName:
                                        !stageViewOptions.showChannelName,
                                }))
                            }
                        >
                            <p className="text-lg select-none">Channel Name</p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showChannelName
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showViewCount:
                                        !stageViewOptions.showViewCount,
                                }))
                            }
                        >
                            <p className="text-lg select-none">View Count</p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showViewCount
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showPublishedAt:
                                        !stageViewOptions.showPublishedAt,
                                }))
                            }
                        >
                            <p className="text-lg select-none">Publish Date</p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showPublishedAt
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showCategory:
                                        !stageViewOptions.showCategory,
                                }))
                            }
                        >
                            <p className="text-lg select-none">Category</p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showCategory
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showDuration:
                                        !stageViewOptions.showDuration,
                                }))
                            }
                        >
                            <p className="text-lg select-none">Duration</p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showDuration
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                        <div
                            className="py-2 hover:cursor-pointer hover:bg-[#aaaaaa]/20 flex justify-between items-center w-full gap-5 mb-1"
                            onClick={() =>
                                setStageViewOptions((prev) => ({
                                    ...prev,
                                    showDescription:
                                        !stageViewOptions.showDescription,
                                }))
                            }
                        >
                            <p className="text-lg select-none">
                                {"Description (on hover)"}
                            </p>
                            <FontAwesomeIcon
                                icon={
                                    stageViewOptions.showDescription
                                        ? faCircleCheck
                                        : faCircle
                                }
                                className="text-2xl"
                            />
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>

            <Splide
                aria-label="My Favorite Images"
                options={{
                    pagination: true,
                    rewind: false,
                    width: "100vw",
                    // gap: "1rem",
                    height: "100vh",
                    keyboard: "global",
                    wheel: true,
                    direction: "ttb",
                    speed: 1000,
                }}
            >
                {videoData == null
                    ? "Yes, null"
                    : videoData.map((item, index) => (
                          <SplideSlide key={index}>
                              <div
                                  style={{
                                      backgroundImage: `radial-gradient(ellipse at center,${averageColorThumbnails[videoData.indexOf(item)]?.[1]} 0%,rgba(15, 15, 15, 0.9) 60%,#0f0f0f 100%)`,
                                  }}
                                  className=" flex justify-center items-center p-5 h-full transition-all duration-200 mx-3"
                              >
                                  <div className="flex flex-col sm:gap-1 gap-0 w-[1200px]">
                                      <a
                                          href={`https://www.youtube.com/watch?v=${item.id}`}
                                          target="_blank"
                                          className="aspect-video relative overflow-hidden rounded-[10px] group w-full h-full"
                                      >
                                          {!item.statistics.viewCount &&
                                          item.contentDetails.duration ==
                                              "P0D" ? (
                                              <div className="absolute w-full h-full bg-black/100 text-white rounded-[10px] z-10">
                                                  <div className="flex flex-col justify-center items-center h-full">
                                                      <p className="text-xl">
                                                          Video unavailable
                                                      </p>
                                                      <p className="text-xs">
                                                          This video is not
                                                          available
                                                      </p>
                                                  </div>
                                              </div>
                                          ) : (
                                              ""
                                          )}
                                          {/* Show/Hide Video Duration */}
                                          {stageViewOptions.showDuration ? (
                                              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 py-1.5 px-1 z-20 bg-[#0f0f0f]/80 text-white flex justify-center items-center md:text-2xl sm:text-lg text-md sm:rounded-sm rounded-lg">
                                                  <div className="leading-3 pb-[.18rem]">
                                                      {getVideoDuration(
                                                          item.contentDetails
                                                              .duration,
                                                      )}
                                                  </div>
                                              </div>
                                          ) : (
                                              ""
                                          )}

                                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 lg:top-4 lg:left-4 md:text-2xl sm:text-lg text-md bg-[#0f0f0f]/80 text-white pb-0.5 px-2 z-20 sm:rounded-sm rounded-lg">
                                              #{videoData.indexOf(item) + 1} ON
                                              TRENDING
                                          </div>
                                          {stageViewOptions.showDescription ? (
                                              <div
                                                  style={{
                                                      backgroundImage:
                                                          "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(5, 5, 5, 1))",
                                                  }}
                                                  className="absolute bottom-0 w-full h-[70%] object-cover z-10 group-hover:opacity-[100%] opacity-0 transition-opacity p-4"
                                              >
                                                  <div className="h-full w-[90%] flex flex-col justify-end text-[#aaaaaa] text-sm sm:text-md md:text-lg lg:text-xl">
                                                      <p className="line-clamp-3">
                                                          {
                                                              item.snippet
                                                                  .description
                                                          }
                                                      </p>
                                                  </div>
                                              </div>
                                          ) : (
                                              ""
                                          )}
                                          <img
                                              src={getHighestQualityThumbnail(
                                                  item,
                                              )}
                                              className={`aspect-video object-cover h-full w-full transition-all duration-100 -z-10 rounded-[10px] ${
                                                  !item.statistics.viewCount &&
                                                  item.contentDetails
                                                      .duration == "P0D"
                                                      ? "blur-md"
                                                      : ""
                                              }`} //group-hover:blur-xl
                                          />
                                      </a>
                                      {stageViewOptions.showTitle ? (
                                          <div className="text-[#f1f1f1] lg:text-3xl md:text-2xl sm:text-xl text-sm line-clamp-2 w-full md:pt-2 pt-1">
                                              {item.snippet.title}
                                          </div>
                                      ) : (
                                          ""
                                      )}

                                      <div className="flex md:gap-2 gap-1.5 text-[#aaaaaa] w-full items-center">
                                          {stageViewOptions.showChannelName ? (
                                              <>
                                                  <div className="truncate max-w-[45%] lg:text-xl md:text-lg sm:text-md sm:text-sm text-xs">
                                                      {
                                                          item.snippet
                                                              .channelTitle
                                                      }
                                                  </div>
                                                  <div className="text-lg">
                                                      •
                                                  </div>
                                              </>
                                          ) : (
                                              ""
                                          )}
                                          {item.statistics.viewCount &&
                                          stageViewOptions.showViewCount ? (
                                              <div className="flex w-fit lg:text-xl md:text-lg sm:text-md sm:text-sm text-xs">
                                                  <NumericLabel
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
                                          ) : (
                                              ""
                                          )}
                                          {item.statistics.viewCount &&
                                          stageViewOptions.showViewCount ? (
                                              <div className="text-lg">•</div>
                                          ) : (
                                              ""
                                          )}
                                          {stageViewOptions.showPublishedAt ? (
                                              <div className="w-fit lg:text-xl md:text-lg sm:text-md sm:text-sm text-xs flex items-center">
                                                  <ReactTimeAgo
                                                      date={
                                                          new Date(
                                                              item.snippet
                                                                  .publishedAt,
                                                          )
                                                      }
                                                  />
                                                  <div className="text-lg text-transparent">
                                                      •
                                                  </div>
                                              </div>
                                          ) : (
                                              ""
                                          )}
                                      </div>
                                      {stageViewOptions.showCategory ? (
                                          <div className="text-white/50 flex gap-1.5 bg-[#aaaaaa]/10 rounded-[5px] w-fit items-center justify-center px-1 mt-2">
                                              <div className="text-xs sm:text-md md:text-lg flex justify-center items-center h-6 w-6">
                                                  {
                                                      videoCategoryIcons[
                                                          item.snippet
                                                              .categoryId
                                                      ]
                                                  }
                                              </div>
                                              <div className="text-xs sm:text-md md:text-lg lg:text-xl flex justify-center items-center leading-[25px] pb-1 pr-0.5">
                                                  {
                                                      videoCategories[
                                                          item.snippet
                                                              .categoryId
                                                      ]
                                                  }
                                              </div>
                                          </div>
                                      ) : (
                                          ""
                                      )}
                                  </div>
                              </div>
                          </SplideSlide>
                      ))}
            </Splide>
        </div>
    );
};

export default StageView;
