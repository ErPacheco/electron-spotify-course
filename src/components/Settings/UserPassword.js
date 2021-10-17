import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import alertErrors from '../../utils/AlertError';
import { reauthenticate } from '../../utils/Api';
import firebase from '../../utils/Firebase';
import 'firebase/compat/auth';

export default function UserPassword(props) {
	const { setShowModal, setTitleModal, setContentModal } = props;
	const onEdit = () => {
		setTitleModal('Actualizar contraseña');
		setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
		setShowModal(true);
	};
	return (
		<div className='user-password'>
			<h3>Contraseña: ****</h3>
			<Button circular onClick={onEdit}>
				Actualizar
			</Button>
		</div>
	);
}

function ChangePasswordForm(props) {
	const { setShowModal } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [showPasswords, setShowPasswords] = useState({
		oldPassword: false,
		newPassword: false,
		repeatPassword: false,
	});
	const [formData, setFormData] = useState({
		oldPassword: '',
		newPassword: '',
		repeatPassword: '',
	});

	const onSubmit = () => {
		if (
			!formData.oldPassword ||
			!formData.newPassword ||
			!formData.repeatPassword
		) {
			toast.warning('Las contraseñas no pueden estar vacías.');
		} else if (formData.oldPassword === formData.newPassword) {
			toast.warning('La nueva contraseña no puede ser igual a la actual.');
		} else if (formData.newPassword !== formData.repeatPassword) {
			toast.warning('Las nuevas contraseñas no son iguales');
		} else if (formData.newPassword.length < 6) {
			toast.warning('La contraseña tiene que tener mínimo 6 caracteres.');
		} else {
			setIsLoading(true);
			reauthenticate(formData.oldPassword)
				.then(() => {
					const currentUser = firebase.auth().currentUser;
					currentUser
						.updatePassword(formData.newPassword)
						.then(() => {
							toast.success('Contraseña actualizada.');
							setIsLoading(false);
							setShowModal(false);
							firebase.auth().signOut();
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

	const handlerShowPassword = (inputPass) => {
		setShowPasswords({
			...showPasswords,
			[inputPass]: !showPasswords[inputPass],
		});
	};

	return (
		<Form onSubmit={onSubmit}>
			<Form.Field>
				<Input
					placeholder='Contraseña'
					type={showPasswords.oldPassword ? 'text' : 'password'}
					icon={
						<Icon
							name={showPasswords.oldPassword ? 'eye slash outline' : 'eye'}
							link
							onClick={() => handlerShowPassword('oldPassword')}
						/>
					}
					onChange={(e) =>
						setFormData({ ...formData, oldPassword: e.target.value })
					}
				/>
			</Form.Field>
			<Form.Field>
				<Input
					placeholder='Nueva contraseña'
					type={showPasswords.newPassword ? 'text' : 'password'}
					icon={
						<Icon
							name={showPasswords.newPassword ? 'eye slash outline' : 'eye'}
							link
							onClick={() => handlerShowPassword('newPassword')}
						/>
					}
					onChange={(e) =>
						setFormData({ ...formData, newPassword: e.target.value })
					}
				/>
			</Form.Field>
			<Form.Field>
				<Input
					placeholder='Repetir nueva contraseña'
					type={showPasswords.repeatPassword ? 'text' : 'password'}
					icon={
						<Icon
							name={showPasswords.repeatPassword ? 'eye slash outline' : 'eye'}
							link
							onClick={() => handlerShowPassword('repeatPassword')}
						/>
					}
					onChange={(e) =>
						setFormData({ ...formData, repeatPassword: e.target.value })
					}
				/>
			</Form.Field>
			<Button type='submit' loading={isLoading}>
				Actualizar contraseña
			</Button>
		</Form>
	);
}
