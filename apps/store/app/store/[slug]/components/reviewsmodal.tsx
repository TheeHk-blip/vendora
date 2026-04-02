"use client";

import { StarRate } from "@mui/icons-material";
import { Button, IReview, useDrawer } from "@vendora/ui";
import { AnimatePresence, motion } from "framer-motion";

interface ReviewProps {
  reviewInfo: IReview[]
}

export function ReviewsModal({reviewInfo}: ReviewProps) {
  const { openDrawer, openDrawerId, closeDrawer } = useDrawer();
  const isOpen = openDrawerId === "reviews"
  return(
    <AnimatePresence>      
      {reviewInfo && reviewInfo.length > 0 &&
        <span className="flex flex-row items-center gap-2 mb-2">
          <h3>Reviews: {reviewInfo?.length}</h3>        
          {isOpen ? (
            <Button
              onClick={closeDrawer}
            >
              Close
            </Button>
          ):(
            <Button 
              onClick={() => openDrawer("reviews")}
            >
              See All
            </Button>
          )}
        </span>  
      }
       
      {isOpen && (      
        <motion.div
          key={"reviews-drawer"}
          initial={{ x: -50, opacity: 0}}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0}}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 10,
            restDelta: 2
          }}
          className="h-50 bg-white dark:bg-black px-2.5 py-1.5 rounded-xl overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div id="reviews" >                
            {reviewInfo && reviewInfo.map((review) => (
              <div key={review?.reviewerId._id} className="bg-foreground/20 px-2 py-1 rounded-xl flex flex-col mb-1">
                <div className="flex flex-row gap-2 text-gray-600 dark:text-gray-300">
                  <span>{review?.reviewerId.name}</span>
                  <span className="flex items-center">{review.rating} <StarRate sx={{width: 20, height: 20}} className=" mb-1" /></span>
                </div>
                <div>{review?.comment}</div>
              </div>        
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}