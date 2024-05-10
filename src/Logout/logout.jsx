import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiHost from '../utils/api';


function Logout(userDetails) {
	const user = userDetails.user;
	const logout = () => {
		window.open(`${apiHost}/auth/logout`, "_self");
	};
	return (
		<div >
			<div >
				
				<div >
					
					
					
					<button  onClick={logout}>
						Log Out
					</button>
				</div>
			</div>
		</div>
	);
}

export default Logout;