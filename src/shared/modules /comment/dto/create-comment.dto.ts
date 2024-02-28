import { Max, MaxLength, Min, MinLength, IsMongoId } from 'class-validator';
import { CreateCommentMessage } from './create-comment.messages.js';
import { CommentDtoConst } from './commnent-dto.const.js';


export class CreateCommentDto {
  @MinLength(CommentDtoConst.MinLengthComment, {message: CreateCommentMessage.text.minLength})
  @MaxLength(CommentDtoConst.MaxLengthComment, {message: CreateCommentMessage.text.maxLength})
  public text: string;

  @Min(CommentDtoConst.MinRating, { message: CreateCommentMessage.rating.min })
  @Max(CommentDtoConst.MaxRating, { message: CreateCommentMessage.rating.max })
  public raiting: number;

  @IsMongoId({ message: CreateCommentMessage.userId.isMongoId })
  public userId: string;

  @IsMongoId({ message: CreateCommentMessage.rentId.isMongoId })
  public rentId: string;
}
