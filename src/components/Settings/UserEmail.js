import React, { useState } from 'react';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { reauthenticate } from '../../utils/Api';
import alertErrors from '../../utils/AlertError';
import firebase from '../../utils/Firebase';
import 'firebase/compat/auth';

export default function UserEmail(props) {
	const { user, setShowModal, setTitleModal, setContentModal } = props;

	const onEdit = () => {
		setTitleModal('Actualizar email');
		setContentModal(
			<ChangeEmailForm email={user.email} setShowModal={setShowModal} />
		);
		setShowModal(true);
	};

	return (
		<div className='user-email'>
			<h3>Email: {user.email}</h3>
			<Button circular onClick={onEdit}>
				Actualizar
			</Button>
		</div>
	);
}

function ChangeEmailForm(props) {
	const { email, setShowModal } = props;
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handlerShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onSubmit = () => {
		if (!formData.email) {
			toast.warning('El email es el mismo o está vacío');
		} else {
			setIsLoading(true);
			reauthenticate(formData.password)
				.then(() => {
					const currentUser = firebase.auth().currentUser;

					currentUser
						.updateEmail(formData.email)
						.then(() => {
							toast.success('Email actualizado.');
							setIsLoading(false);
							setShowModal(false);

							currentUser.sendEmailVerification().then(() => {
								firebase.auth().signOut();
							});
						})
						.catch((error) => {
							alertErrors(error?.code);
							setIsLoading(false);
						});
				})
				.catch((error) => {
					alertErrors(error?.code);
					setIsLoading(false);
				});
		}
	};

	return (
		<Form onSubmit={onSubmit}>
			<Form.Field>
				<Input
					defaultValue={email}
					type='text'
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
			</Form.Field>
			<Form.Field>
				<Input
					placeholder='Contraseña'
					type={showPassword ? 'text' : 'password'}
					icon={
						<Icon
							name={showPassword ? 'eye slash outline' : 'eye'}
							link
							onClick={handlerShowPassword}
						/>
					}
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
				/>
			</Form.Field>
			<Button type='submit' loading={isLoading}>
				Actualizar email
			</Button>
		</Form>
	);
}
