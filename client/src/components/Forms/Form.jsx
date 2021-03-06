import React, { useEffect, useState } from 'react';
import { Paper, TextField, Typography, Button } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import { createPost, updatePost } from '../../store/posts';

const emptyPost = {
	title: '',
	message: '',
	tags: '',
	selectedFile: '',
};

const Form = ({ currentId, setCurrentId }) => {
	const [postData, setPostData] = useState(emptyPost);

	const postUpdating = useSelector((state) =>
		currentId ? state.posts.list.find((post) => post._id === currentId) : null
	);

	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();

	const user = JSON.parse(localStorage.getItem('profile'));

	useEffect(() => {
		if (postUpdating) setPostData(postUpdating);
	}, [postUpdating]);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (currentId) dispatch(updatePost(currentId, postData));
		else
			dispatch(createPost({ ...postData, name: user?.result?.name })).then((res) =>
				history.push('/posts/' + res._id)
			);

		clear();
	};

	const clear = () => {
		setCurrentId(null);
		setPostData(emptyPost);
	};

	if (!user?.result?.name) {
		return (
			<Paper className={classes.paper}>
				<Typography variant='h6' align='center'>
					Please Sign In to create your own post and like other's post.
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper className={classes.paper} elevation={6}>
			<form
				autoComplete='off'
				noValidate
				className={`${classes.root} ${classes.form}`}
				onSubmit={handleSubmit}
			>
				<Typography variant='h6'>
					{currentId ? 'Editing' : 'Creating'} a Memory
				</Typography>

				<TextField
					name='title'
					variant='outlined'
					label='Title'
					fullWidth
					value={postData.title ?? ''}
					onChange={(e) => setPostData({ ...postData, title: e.target.value })}
				/>
				<TextField
					name='message'
					variant='outlined'
					label='Message'
					fullWidth
					value={postData.message ?? ''}
					onChange={(e) =>
						setPostData({ ...postData, message: e.target.value })
					}
				/>
				<TextField
					name='tags'
					variant='outlined'
					label='Tags (comma separated)'
					fullWidth
					value={postData.tags ?? ''}
					onChange={(e) =>
						setPostData({ ...postData, tags: e.target.value.split(',') })
					}
				/>
				<div className={classes.fileInput}>
					<FileBase
						type='file'
						multiple={false}
						onDone={({ base64 }) =>
							setPostData({ ...postData, selectedFile: base64 })
						}
					/>
				</div>
				<Button
					className={classes.buttonSubmit}
					variant='contained'
					color='primary'
					size='large'
					type='submit'
					fullWidth
				>
					{currentId ? 'Update' : 'Submit'}
				</Button>
				<Button
					className={classes.buttonSubmit}
					variant='contained'
					color='secondary'
					size='small'
					onClick={clear}
					fullWidth
				>
					Clear
				</Button>
			</form>
		</Paper>
	);
};

export default Form;
