import React, { useState } from 'react';
import { MdMoreVert } from "react-icons/md";
import './css/Comment_Item.css';
import { gql, useMutation } from '@apollo/client';
const DELETE_REPLY = gql`
  mutation DeleteReply($reply_id: String!) {
    deleteReply(reply_id: $reply_id)
    {
      id
      title
      detail
    }
  }
`;

const UPDATE_REPLY = gql`
  mutation UpdateReply($reply_id: String!, $detail: String!) {
    updateReply(reply_id: $reply_id, detail: $detail) {
      id
      detail
    }
  }
`;
const INCREASE_REPLY_LIKE = gql`
  mutation IncreaseReplyLike($reply_id: String!) {
    increaseReplyLike(reply_id: $reply_id) {
      id
    }
  }
`;

const DECREASE_REPLY_LIKE = gql`
  mutation DecreaseReplyLike($reply_id: String!) {
    decreaseReplyLike(reply_id: $reply_id) 
  }
`;

// 댓글 컴포넌트
export default function Comment_Item({comment}) {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetail, setEditedDetail] = useState(comment.detail);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like);
  // 수정, 삭제 버튼 메뉴 클릭 리스너
  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };
  const [deleteReply] = useMutation(DELETE_REPLY, {
    variables: { reply_id: comment.id },
    onCompleted: () => {
      alert('댓글이 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.'+error);
    }
  });
  const [updateReply] = useMutation(UPDATE_REPLY, {
    variables: { reply_id: comment.id, detail: editedDetail },
    onCompleted: () => {
      setIsEditing(false);
      alert('댓글이 수정되었습니다.');
    },
    onError: (error) => {
      console.error('댓글 수정 중 오류 발생:', error);
      alert('댓글 수정 중 오류가 발생했습니다.'+error);
    }

  });
//댓글 좋아요,좋아요취소 기능
  const [increaseReplyLike] = useMutation(INCREASE_REPLY_LIKE, {
    onCompleted: (data) => {
      console.log(data.increaseReplyLike)
      setLikeCount();
      setLiked(!liked);
    },
    onError: (error) => {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.'+error);
      console.error(JSON.stringify(error, null, 2))
    }
  });

  const [decreaseReplyLike] = useMutation(DECREASE_REPLY_LIKE, {
    onCompleted: () => {
      setLikeCount();
      setLiked(!liked);
    },
  });


  const handleEditClick = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      deleteReply();
    }
  };
  
  const handleLikeClick = () => {
    if (liked) {
      decreaseReplyLike({ variables: { reply_id: comment.id } });
    } else {
      increaseReplyLike({ variables: { reply_id: comment.id } });
    }
  };
  const handleSaveClick = () => {
    updateReply();
  };
  return (
    <div className='comment-container0'>
      
      <div className='comment-photo'>
        <p>사진</p>
      </div>
      <div className='comment-title'>
        <div className='comment-container1'>
          <div className='comment-name'>
            <p>이름: {comment.user.name}</p>
          </div>
          <div className='comment-more' onClick={handleOptionsClick}>
            <MdMoreVert />
            {showOptions && (
              <div className='comment-options'>
             <button onClick={handleEditClick}>수정</button>
                <button onClick={handleDeleteClick}>삭제</button>
              </div>
            )}
          </div>
        </div>
        <div className='comment-container2'>
          <div className='comment-post'>
          {isEditing ? (
              <input
                type="text"
                value={editedDetail}
                onChange={(e) => setEditedDetail(e.target.value)}
              />
            ) : (
              <p>{editedDetail}</p>
            )}
          </div>
        </div>
        {isEditing && (
          <div className='comment-container3'>
            <button onClick={handleSaveClick}>저장</button>
            <button onClick={() => setIsEditing(false)}>취소</button>
          </div>
        )}
        <div className='comment-container3'>
          <div className='comment-recomment'>
            <p>답글달기</p>
          </div>
          <div className='comment-like'>
          <button onClick={handleLikeClick} className='like-button'>
          {liked ? '좋아요 취소' : '좋아요'}
          </button>
          <h6>좋아요수: {likeCount} </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
