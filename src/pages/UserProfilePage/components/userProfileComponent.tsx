import React, { useState } from 'react';
import { Avatar, Typography, Button, Box } from '@mui/material';
import usei18next from '../../../hooks/usei18next';
import ChangePassComponent from './changePassComponent';
import ChangeUserProfile from './changeUserProfile';
import UserInformationComponent from './userInformationComponent';
import { AuthContext } from '../../../contexts/AuthContext';
import MyCustomButton from '../../../components/common/MyButton';
import { useNavigate } from 'react-router-dom';
import MyIcon from '../../../components/common/MyIcon';
import ArrowBack from '@mui/icons-material/ArrowBack';

function UserProfileComponent() {

  const [type, setType] = useState<string>('info');
  const { t } = usei18next();
  const [showButtons, setShowButtons] = useState(true);

  const handleShowButtons = () => {
    setShowButtons(true);
    setType('info');
  };

  return (
    <Box width={"100%%"} padding={"32px"}>
      {showButtons && (
        <Box width={"100%%"} display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} gap={2}>
          <Box width={"45%"} display={"flex"} flexDirection={"row"} justifyContent={"start"}>
            <Typography variant="h5" fontWeight="600" fontSize={"32px"} >{t("userProfile.Title")}</Typography>
          </Box>
          <Box width={"10%"} />
          <Box width={"45%"} display={"flex"} flexDirection={"row"} justifyContent={"end"} gap={2}>
            <MyCustomButton
              borderRadius={8}
              fontSize={16}
              fontWeight={400}
              content={t("userProfile.ChangeProfile")}
              onClick={() => {
                setType('changeUser');
                setShowButtons(false);
              }}
            />
            <MyCustomButton
              borderRadius={8}
              fontSize={16}
              fontWeight={400}
              content={t("userProfile.ChangePassword")}
              onClick={() => {
                setType('changePass');
                setShowButtons(false);
              }}
            />
          </Box>
        </Box>)}

      {type === 'info' && <UserInformationComponent />}

      {type === 'changePass' &&

        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Phần 1 - Layout theo chiều ngang */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <MyIcon icon={<ArrowBack />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => {
              setType('info');
              setShowButtons(true);
            }} position='right' />
            <Typography width={"100%"} variant="h5" fontWeight="600" fontSize={"32px"}>
            {t("changePassword.Title")}
            </Typography>
          </Box>

          {/* Phần 2 - ChangUserProfile component */}
          <Box sx={{width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
            <ChangePassComponent setType={handleShowButtons} />
          </Box>
        </Box>
      }

      {type === 'changeUser' &&
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Phần 1 - Layout theo chiều ngang */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <MyIcon icon={<ArrowBack />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => {
              setType('info');
              setShowButtons(true);
            }} position='right' />
            <Typography width={"100%"} variant="h5" fontWeight="600" fontSize={"32px"}>
              {t("userProfile.ChangeProfile")}
            </Typography>
          </Box>

          {/* Phần 2 - ChangUserProfile component */}
          <Box sx={{width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
            <ChangeUserProfile setType={handleShowButtons} />
          </Box>
        </Box>

      }
    </Box>
  );
}

export default UserProfileComponent;
