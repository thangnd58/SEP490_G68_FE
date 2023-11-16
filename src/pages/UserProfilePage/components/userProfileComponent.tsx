import React, { useEffect, useState } from 'react';
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
import useThemePage from '../../../hooks/useThemePage';
import ChangePhoneComponent from './changePhoneNumber';
import VerifyPhoneNumberComponent from './verifyPhoneNumberComponent';

function UserProfileComponent() {

  const [type, setType] = useState<string>('info');
  const { t } = usei18next();
  const [showButtons, setShowButtons] = useState(true);
  const { isMobile } = useThemePage();
  const handleShowButtons = () => {
    setShowButtons(true);
    setType('info');
  };

  return (
    <Box width={"100%%"} padding={isMobile ? "16px":"32px"} >
      {showButtons && (
        <Box width={"100%"} display={"flex"} flexDirection={isMobile ? "column" : "row"} alignItems={'center'} justifyContent={isMobile ? "center" : "space-between"} gap={2}>
          <Box width={isMobile ? "100%" : "50%"} display={"flex"} flexDirection={"row"} justifyContent={isMobile ? "center" : "start"}>
            <Typography variant="h5" fontWeight="600" fontSize={isMobile ?"24px":"32px"} >{t("userProfile.Title")}</Typography>
          </Box>
          <Box width={isMobile ? "100%" : "50%"} display={"flex"} flexDirection={"row"} justifyContent={isMobile ? "center" : "end"} gap={2}>
            <MyCustomButton
              borderRadius={8}
              fontSize={isMobile ? 12 : 16}
              fontWeight={400}
              content={t("userProfile.ChangeProfile")}
              onClick={() => {
                setType('changeUser');
                setShowButtons(false);
              }}
            />
            <MyCustomButton
              borderRadius={8}
              fontSize={isMobile ? 12 : 16}
              fontWeight={400}
              content={t("userProfile.ChangePassword")}
              onClick={() => {
                setType('changePass');
                setShowButtons(false);
              }}
            />
          </Box>
        </Box>
      )}

      {type === 'info' && <UserInformationComponent setType={setType} setShowButtons={setShowButtons} />}

      {type === 'changePass' &&

        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Phần 1 - Layout theo chiều ngang */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <MyIcon icon={<ArrowBack />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => {
              setType('info');
              setShowButtons(true);
            }} position='right' />
            <Typography width={"100%"} variant="h5" fontWeight="600" fontSize={isMobile ? "24px" : "32px"}>
              {t("changePassword.Title")}
            </Typography>
          </Box>

          {/* Phần 2 - ChangUserProfile component */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
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
            <Typography width={"100%"} variant="h5" fontWeight="600" fontSize={isMobile ? "24px" : "32px"}>
              {t("userProfile.ChangeProfile")}
            </Typography>
          </Box>

          {/* Phần 2 - ChangUserProfile component */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
            <ChangeUserProfile setType={handleShowButtons} />
          </Box>
        </Box>

      }
      {type === 'changePhone' &&
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Phần 1 - Layout theo chiều ngang */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <MyIcon icon={<ArrowBack />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => {
              setType('info');
              setShowButtons(true);
            }} position='right' />
            <Typography width={"100%"} variant="h5" fontWeight="600" fontSize={isMobile ? "24px" : "32px"}>
              {t("ChangePhone.Title")}
            </Typography>
          </Box>

          {/* Phần 2 - ChangPhone component */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
            <ChangePhoneComponent setType={handleShowButtons} />
          </Box>
        </Box>

      }
      {type === 'verifyPhone' &&
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {/* Phần 1 - Layout theo chiều ngang */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
            <MyIcon icon={<ArrowBack />} hasTooltip tooltipText={t("postMotorbike.registedForm.badge-back")} onClick={() => {
              setType('info');
              setShowButtons(true);
            }} position='right' />
            <Typography width={"100%"} variant="h5" fontWeight="600" fontSize={isMobile ? "24px" : "32px"}>
              {t("VerifyPhone.Title")}
            </Typography>
          </Box>

          {/* Phần 2 - verify Phone component */}
          <Box sx={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
            <VerifyPhoneNumberComponent setType={handleShowButtons} />
          </Box>
        </Box>

      }
    </Box>
  );
}

export default UserProfileComponent;
