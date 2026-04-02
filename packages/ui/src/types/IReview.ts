export interface IReview {  
  comment: string;
  rating: number;
  reviewerId: {
    _id: string,
    name: string
  };
  name: string; 
}