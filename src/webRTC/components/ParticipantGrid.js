import React from "react";
import { ParticipantView } from "./ParticipantView";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { useParticipant } from "@videosdk.live/react-sdk";
import secureLocalStorage from "react-secure-storage";

const MemoizedParticipant = React.memo(
  ParticipantView,
  (prevProps, nextProps) => {
    return prevProps.participantId === nextProps.participantId;
  }
);

function ParticipantGrid({ participantIds, isPresenting }) {
  const { sideBarMode } = useMeetingAppContext();
  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  const perRow =
    isMobile || isPresenting
      ? participantIds.length < 4
        ? 1
        : participantIds.length < 9
        ? 2
        : 3
      : participantIds.length < 5
      ? 2
      : participantIds.length < 7
      ? 3
      : participantIds.length < 9
      ? 4
      : participantIds.length < 10
      ? 3
      : participantIds.length < 11
      ? 4
      : 4;

  const GetData = (id) => {
    const { isLocal } = useParticipant(id);
    return isLocal;
  };
  return (
    // <div
    //   className={`flex flex-col md:flex-row flex-grow m-3 items-center justify-center md:px-16 md-py-5`}
    // >
    //   <div className="flex flex-col w-full h-full">
    //     {Array.from(
    //       { length: Math.ceil(participantIds.length / perRow) },
    //       (_, i) => {
    //         return (
    //           <div
    //             key={`participant-${i}`}
    //             className={`d-flex  ${"align-items-center justify-content-center"}`}
    //           >
    //             {participantIds
    //               .slice(i * perRow, (i + 1) * perRow)
    //               .map((participantId) => {
    //                 return (
    //                   <div
    //                     key={`participant_${participantId}`}
    //                     className={`flex flex-1 ${"md:w-44 xl:w-56"} align-items-center justify-content-center h-100 `}
    //                   >
    //                     <MemoizedParticipant participantId={participantId} />
    //                   </div>
    //                 );
    //               })}
    //           </div>
    //         );
    //       }
    //     )}
    //   </div>
    // </div>

    <div className="row h-75">
      {Array.from(
        { length: Math.ceil(participantIds.length / perRow) },
        (_, i) => {
          return (
            <div
              key={`participant-${i}`}
              className="col-md-12 row justify-content-center "
            >
              <div className="col-sm-10 position-relative">
                {participantIds.map((participantId) => {
                  return !GetData(participantId) ? (
                    <div
                      key={`participant_${participantId}`}
                      className="w-100 h-100"
                    >
                      <MemoizedParticipant participantId={participantId} />
                    </div>
                  ) : (
                    <div
                      key={`participant_${participantId}`}
                      className="position-absolute w-25 h-25 z-1 bottom-0"
                      style={{ right: 20 }}
                    >
                      <MemoizedParticipant participantId={participantId} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export const MemoizedParticipantGrid = React.memo(
  ParticipantGrid,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.participantIds) ===
        JSON.stringify(nextProps.participantIds) &&
      prevProps.isPresenting === nextProps.isPresenting
    );
  }
);
