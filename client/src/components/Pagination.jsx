import React, { useEffect } from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { loadPosts } from '../store/posts';

const Paginate = ({ page }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const posts = useSelector((state) => state.posts);

	useEffect(() => {
		if (page) dispatch(loadPosts(page));
	}, [page]);

	return (
		<Pagination
			classes={{ ul: classes.ul }}
			count={posts.numberOfPages}
			page={Number(page) || 1}
			variant='outlined'
			color='primary'
			renderItem={(item) => (
				<PaginationItem
					{...item}
					component={Link}
					to={`/posts?page=${item.page}`}
				/>
			)}
		/>
	);
};

export default Paginate;
