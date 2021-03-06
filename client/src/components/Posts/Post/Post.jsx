import React, { useState } from 'react';
import {
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	ButtonBase,
	Typography,
} from '@material-ui/core';
import ThumUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import { deletePost, likePost } from '../../../store/posts';

const Post = ({ post, setCurrentId }) => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const history = useHistory();
	const user = JSON.parse(localStorage.getItem('profile'));
	const [likes, setLikes] = useState(post.likes);

	const userId = user?.result?.googleId || user?.result?._id;
	const hasLikedPost = post.likes.find((id) => id === userId);

	const handleLike = () => {
		dispatch(likePost(post._id));
		if (hasLikedPost) setLikes(post.likes.filter((id) => id !== userId));
		else setLikes([...post.likes, userId]);
	};

	const Likes = () => {
		if (likes.length > 0) {
			return likes.find((id) => id === userId) ? (
				<>
					<ThumUpAltIcon fontSize='small' />
					&nbsp;
					{likes.length > 2
						? `You and ${likes.length - 1} others`
						: `${likes.length} like${likes.length > 1 ? 's' : ''}`}
				</>
			) : (
				<>
					<ThumUpAltOutlined fontSize='small' />
					&nbsp;
					{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
				</>
			);
		}

		return (
			<>
				<ThumUpAltOutlined fontSize='small' />
				&nbsp;Like
			</>
		);
	};

	const openPost = () => history.push(`/posts/${post._id}`);

	return (
		<Card className={classes.card} raised elevation={6}>
			<CardMedia
				className={classes.media}
				image={post.selectedFile}
				title={post.title}
			/>

			<div className={classes.overlay}>
				<Typography variant='h6'>{post.name}</Typography>
				<Typography variant='body2'>
					{moment(post.createdAt).fromNow()}
				</Typography>
			</div>
			{(user?.result?.googleId === post?.creator ||
				user?.result?._id === post.creator) && (
				<div className={classes.overlay2}>
					<Button
						style={{ color: 'white' }}
						size='small'
						onClick={() => setCurrentId(post._id)}
						disabled={!user?.result}
					>
						<MoreHorizIcon fontSize='medium' />
					</Button>
				</div>
			)}
			<ButtonBase className={classes.cardAction} onClick={openPost}>
				<div className={classes.details}>
					<Typography variant='body2' color='textSecondary'>
						{post.tags.map((tag) => `#${tag} `)}
					</Typography>
				</div>
				<Typography className={classes.title} variant='h5' gutterBottom>
					{post.title}
				</Typography>
				<CardContent>
					<Typography variant='body2' color='textSecondary' component='p'>
						{post.message}
					</Typography>
				</CardContent>
			</ButtonBase>
			<CardActions className={classes.cardActions}>
				<Button
					size='small'
					color='primary'
					onClick={handleLike}
					disabled={!user?.result}
				>
					<Likes />
				</Button>
				{(user?.result?.googleId === post?.creator ||
					user?.result?._id === post.creator) && (
					<Button
						size='small'
						color='secondary'
						onClick={() => dispatch(deletePost(post._id))}
						disabled={!user?.result}
					>
						<DeleteIcon fontSize='small' />
						Delete
					</Button>
				)}
			</CardActions>
		</Card>
	);
};

export default Post;
