import React, { memo, useState, useContext, useEffect } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import UserService from "../../services/UserService";
import { AuthContext, useAuth } from "../../contexts/AuthContext";
import usei18next from "../../hooks/usei18next";
import { useNavigate } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import useThemePage from "../../hooks/useThemePage";
import {
  AccountBox,
  AddShoppingCart,
  ArrowDownward,
  ArrowDropDown,
  Circle,
  Close,
  CloseOutlined,
  ExitToApp,
  Home,
  ListAlt,
  Loyalty,
  ManageAccounts,
  MarkunreadMailboxOutlined,
  MoreVert,
  Notifications,
  NotificationsActive,
  NotificationsActiveOutlined,
  NotificationsOutlined,
  Search,
  ShoppingCartCheckout,
  VpnKey,
  WalletOutlined,
} from "@mui/icons-material";
import {
  LogoHeader,
  NotificationIcon,
  UnitedKingDomFlag,
  VietNamFlag,
} from "../../assets/images";
import { ROUTES, SERVER_URL } from "../../utils/Constant";
import MyIcon from "../../components/common/MyIcon";
import { useAppDispatch, useAppSelector } from "../../hooks/useAction";
import MyCustomButton from "../../components/common/MyButton";
import theme from "../../utils/theme";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { UnReadIcon } from "../../assets/icons";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getPreviousTimeRelative } from "../../utils/helper";
import { ModalContext } from "../../contexts/ModalContext";
import MyDialog from "../../components/common/MyDialog";
import { DetailNotification } from "./DetailNotificationModal";
import store from "../../redux/store";
import { getUserNotificationInfo } from "../../redux/reducers/notificationReducer";
import styled from "@emotion/styled";
import { getCartInfo } from "../../redux/reducers/cartReducer";
import {
  HubConnectionBuilder,
  HubConnectionState,
  HubConnection,
} from "@microsoft/signalr";

const LanguageBox = memo(() => {
  const { isVn, changeLang } = usei18next();
  return (
    <img
      alt="language"
      style={{ cursor: "pointer" }}
      height={32}
      width={32}
      src={isVn ? VietNamFlag : UnitedKingDomFlag}
      onClick={(e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click từ lan tỏa ra ngoài
        changeLang(isVn ? "en" : "vi");
      }}
    />
  );
});

interface IconBoxProps {
  image: string;
  width: number;
  height: number;
  onClick: () => void;
}

export const IconBox = memo(
  ({ image, width, height, onClick }: IconBoxProps) => {
    return (
      <img
        alt="icon"
        style={{ cursor: "pointer" }}
        src={image}
        width={width}
        height={height}
        onClick={onClick}
      />
    );
  }
);

export const LogoFull = memo(({ size }: { size: number }) => {
  const navigate = useNavigate();

  return (
    <img
      style={{ cursor: "pointer" }}
      alt="logo"
      src={LogoHeader}
      width={size}
      onClick={() => navigate(ROUTES.homepage)}
    />
  );
});

interface AnimatedBoxProps {
  isOpen: boolean;
}

const AnimatedBox = styled(Box)<AnimatedBoxProps>`
  transition: all 2s ease;
  overflow-y: auto;
  height: ${(props) => (props.isOpen ? "200px" : "0")};
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
`;

function Header() {
  const { isLogin, logout } = useAuth();
  const { user } = useAppSelector((state) => state.userInfo);
  const { shoppingCart } = useAppSelector((state) => state.shoppingCartInfo);
  const { isVn, t } = usei18next();
  const navigate = useNavigate();
  const { isMobile } = useThemePage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenNoti, setDrawerOpenNoti] = useState(false);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const { setContentModal, setShowModal } = useContext(ModalContext);
  const [isShowMore, setIsShowMore] = useState(false);
  const dispatch = useAppDispatch();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDrawerNoti = () => {
    setDrawerOpenNoti(!drawerOpenNoti);
  };

  const { userNotification } = useAppSelector(
    (state) => state.userNotificationInfo
  );

  useEffect(() => {
    // Kiểm tra nếu có thông báo đầu tiên và title là "Có đơn đặt xe mới"
    if (userNotification.length > 0 && userNotification[0].title === "Có đơn đặt xe mới" && userNotification[0].isRead === false) {
      // Hiển thị Dialog
      setContentModal(
        <DetailNotification
          id={userNotification[0].notificationId}
        />
      );
    }
  }, [userNotification]);


  useEffect(() => {
    setUpSignalRConnection().then((con) => {});
  }, []);

  const setUpSignalRConnection = async () => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${SERVER_URL}/customhub`)
      .withAutomaticReconnect()
      .build();
    connection.on("IsReloadNotification", (reload: boolean) => {
      dispatch(getUserNotificationInfo())
    });

    try {
      await connection.start();
    } catch (err) {
      console.log(err);
    }
    return connection;
  };
  

  useEffect(() => {
    dispatch(getCartInfo());
  }, []);

  //avatar zone
  const [anchorEl, setAnchorEl] = useState<any>(null);

  const handleAvatarClick = (event: React.MouseEvent<any>) => {
    setIsAvatarClicked(true);
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  //notification zone
  const [anchorElNotify, setAnchorElNotify] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickNotify = (event: React.MouseEvent<any>) => {
    setAnchorElNotify(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElNotify(null);
  };

  const openNotify = Boolean(anchorElNotify);

  return (
    <>
      {/* DESKTOP */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ background: "none" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderBottom: (theme: any) =>
              `1px solid ${theme.palette.action.disabledBackground}`,
          }}
        >
          <ListItem sx={{ padding: "24px 0px 24px 32px" }}>
            <LogoFull size={200} />
          </ListItem>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <ListItem
              sx={{
                padding: "18px 32px 18px 0px",
                display: "flex",
                justifyContent: "end",
                gap: "16px",
              }}
            >
              <MyIcon
                icon={<LanguageBox />}
                hasTooltip
                tooltipText={isVn ? "Tiếng Việt" : "English"}
                position="left"
              />

              {isLogin ? (
                <>
                  <Box
                    aria-owns={openNotify ? "hover-menu" : undefined}
                    aria-haspopup="true"
                  >
                    <MyIcon
                      icon={
                        <NotificationsActiveOutlined
                          sx={{ color: "#777E90" }}
                        />
                      }
                      onClick={handleClickNotify}
                      hasBagde={
                        userNotification.filter((item) => item.isRead === false)
                          .length > 0
                      }
                      badgeContent={
                        userNotification.filter((item) => item.isRead === false)
                          .length > 0
                          ? userNotification
                              .filter((item) => item.isRead === false)
                              .length.toString()
                          : ""
                      }
                      badgeColor="primary"
                      hasTooltip
                      aria-describedby={
                        openNotify ? "simple-popover" : undefined
                      }
                      tooltipText={t("header.notification")}
                      position="bottom"
                    />
                    <Popover
                      sx={{
                        marginTop: "16px",
                        maxHeight: "500px",
                      }}
                      open={openNotify}
                      id={openNotify ? "simple-popover" : undefined}
                      anchorEl={anchorElNotify}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      color="primary"
                      // PaperProps={{ sx: { borderRadius: "16px" } }}
                    >
                      <Box
                        sx={{
                          p: "16px",
                          width: "400px",
                        }}
                      >
                        <Typography
                          pb={"16px"}
                          fontWeight={"700"}
                          fontSize={"24px"}
                        >
                          {t("notification.title")}
                        </Typography>
                        <Divider />
                        {userNotification.length > 0 ? (
                          userNotification.map((notifi) => {
                            return (
                              <MenuItem
                                sx={{
                                  textAlign: "center",
                                  borderRadius: "16px",
                                }}
                                key={`NOTIFI${notifi.notificationId}`}
                                onClick={() => {
                                  setContentModal(
                                    <DetailNotification
                                      id={notifi.notificationId}
                                    />
                                  );
                                }}
                              >
                                <PopoverItem
                                  label={notifi.title}
                                  icon={
                                    <img
                                      width={48}
                                      height={48}
                                      src={notifi.category.image}
                                    />
                                  }
                                  iconRead={
                                    !notifi.isRead ? <UnReadIcon /> : undefined
                                  }
                                  content={notifi.detail}
                                  timeAgo={notifi.createDatetime}
                                />
                              </MenuItem>
                            );
                          })
                        ) : (
                          <Typography pt={"8px"}>
                            {t("notification.empty")}
                          </Typography>
                        )}
                      </Box>
                    </Popover>
                  </Box>
                  {user?.role.roleName === "Customer" && (
                    <MyIcon
                      icon={
                        <ShoppingCartCheckout
                          sx={{ color: "#777E90" }}
                          onClick={() => navigate(ROUTES.cart)}
                        />
                      }
                      hasBagde={shoppingCart.length > 0}
                      badgeContent={shoppingCart.length.toString()}
                      hasTooltip
                      tooltipText={t("header.cart")}
                      position="bottom"
                    />
                  )}
                </>
              ) : null}

              <Divider
                sx={{
                  borderLeft: "1px solid #B1B5C3",
                  height: 32,
                }}
              />

              {!isLogin ? (
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  alignContent={"center"}
                  gap={"16px"}
                >
                  <MyCustomButton
                    onClick={() => navigate(ROUTES.account.login)}
                    content={t("header.login")}
                  />
                  <MyCustomButton
                    onClick={() => navigate(ROUTES.account.register)}
                    content={t("header.register")}
                    variant="outlined"
                  />
                </Box>
              ) : (
                <Box
                  aria-owns={open ? "hover-menu" : undefined}
                  aria-haspopup="true"
                >
                  <Avatar
                    src={
                      isLogin
                        ? user && user.avatarUrl
                          ? user.avatarUrl
                          : ""
                        : ""
                    }
                    sx={{ cursor: "pointer" }}
                    onClick={handleAvatarClick}
                  />
                  <Popover
                    sx={{ marginTop: "8px" }}
                    id="hover-menu"
                    open={isAvatarClicked}
                    anchorEl={anchorEl}
                    onClose={() => {
                      setIsAvatarClicked(false);
                      setAnchorEl(null);
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    color="primary"
                  >
                    <>
                      <MenuItem
                        onClick={() => {
                          setIsAvatarClicked(false);
                          setAnchorEl(null);
                          navigate(ROUTES.user.userprofile);
                        }}
                        //hover to change background color
                        sx={{ textAlign: "center" }}
                      >
                        <PopoverItem
                          label={t("header.userprofile")}
                          icon={
                            <AccountBox
                              sx={{
                                color: "#9A9EA5",
                              }}
                            />
                          }
                        />
                      </MenuItem>
                      {user?.role.roleName === "Admin" ||
                      user?.role.roleName === "Staff" ? (
                        <MenuItem
                          onClick={() => {
                            setIsAvatarClicked(false);
                            setAnchorEl(null);
                            navigate(
                              user?.role.roleName === "Staff"
                                ? ROUTES.admin.managemotorbikes
                                : ROUTES.admin.dashboard
                            );
                          }}
                          //hover to change background color
                          sx={{ textAlign: "center" }}
                        >
                          <PopoverItem
                            label={t("header.dashboard")}
                            icon={
                              <ManageAccounts
                                sx={{
                                  color: "#9A9EA5",
                                }}
                              />
                            }
                          />
                        </MenuItem>
                      ) : (
                        <MenuItem
                          onClick={() => {
                            setIsAvatarClicked(false);
                            setAnchorEl(null);
                            navigate(ROUTES.user.listmotorbike);
                          }}
                          //hover to change background color
                          sx={{ textAlign: "center" }}
                        >
                          <PopoverItem
                            label={t("header.mylistmotorbike")}
                            icon={
                              <ListAlt
                                sx={{
                                  color: "#9A9EA5",
                                }}
                              />
                            }
                          />
                        </MenuItem>
                      )}

                      {user?.role.roleName === "Customer" ? (
                        <Box>
                          <MenuItem
                            onClick={() => {
                              setIsAvatarClicked(false);
                              setAnchorEl(null);
                              navigate(ROUTES.user.previewbecomeanowner);
                            }}
                            //hover to change background color
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <PopoverItem
                              label={t("header.registermotorbike")}
                              icon={
                                <VpnKey
                                  sx={{
                                    color: "#9A9EA5",
                                  }}
                                />
                              }
                            />
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setIsAvatarClicked(false);
                              setAnchorEl(null);
                              navigate(ROUTES.booking.mybooking);
                            }}
                            //hover to change background color
                            sx={{ textAlign: "center" }}
                          >
                            <PopoverItem
                              label={t("header.my_booking")}
                              icon={
                                <MarkunreadMailboxOutlined
                                  sx={{ color: "#9A9EA5" }}
                                />
                              }
                            />
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setIsAvatarClicked(false);
                              setAnchorEl(null);
                              navigate(ROUTES.user.favourite);
                            }}
                            //hover to change background color
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <PopoverItem
                              label={t("header.favourite")}
                              icon={
                                <FavoriteIcon
                                  sx={{
                                    color: "#9A9EA5",
                                  }}
                                />
                              }
                            />
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setIsAvatarClicked(false);
                              setAnchorEl(null);
                              navigate(ROUTES.user.wallet);
                            }}
                            //hover to change background color
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <PopoverItem
                              label={t("header.wallet")}
                              icon={
                                <WalletOutlined
                                  sx={{
                                    color: "#9A9EA5",
                                  }}
                                />
                              }
                            />
                          </MenuItem>
                        </Box>
                      ) : null}
                      <MenuItem
                        onClick={() => {
                          setIsAvatarClicked(false);
                          setAnchorEl(null);
                          UserService.logout();
                          logout();
                        }}
                        sx={{ textAlign: "center" }}
                      >
                        <PopoverItem
                          label={t("header.logout")}
                          icon={
                            <ExitToApp
                              sx={{
                                color: "#9A9EA5",
                              }}
                            />
                          }
                        />
                      </MenuItem>
                    </>
                  </Popover>
                </Box>
              )}
            </ListItem>
          )}
        </Box>
      </AppBar>

      {/* MOBILE */}
      <Drawer
        sx={{ "& .MuiDrawer-paper": { width: "100%" } }}
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          style={{
            width: "100%",
            height: "100%",
          }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {isLogin ? (
            <Box
              height={"100%"}
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{}}
            >
              {/* header */}
              <Box
                height={"10%"}
                width={"95%"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 16px",
                }}
              >
                <LogoFull size={150} />
                <MyIcon
                  icon={<Close />}
                  hasTooltip
                  tooltipText={t("header.btn_close")}
                  position="bottom"
                />
              </Box>
              {/* content */}
              <Box
                height={"90%"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  padding: "32px",
                  gap: "16px",
                }}
              >
                <Box
                  width={"100%"}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{ width: 50, height: 50 }}
                    src={user && user.avatarUrl ? user.avatarUrl : ""}
                    onClick={() => {
                      setAnchorEl(null);
                      navigate(ROUTES.user.userprofile);
                    }}
                  />
                  <Typography
                    variant="h3"
                    fontSize={"20px"}
                    sx={{ fontWeight: "500" }}
                  >
                    {user?.name}
                  </Typography>
                  <MyIcon
                    icon={
                      <MoreVert
                        sx={{ color: "#777E90" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click từ lan tỏa ra ngoài
                          setIsShowMore(!isShowMore);
                        }}
                      />
                    }
                    hasTooltip
                    tooltipText={t("header.cart")}
                    position="bottom"
                  />
                </Box>
                {/* list admin */}
                {user?.role.roleName === "Admin" ||
                user?.role.roleName === "Staff" ? (
                  <AnimatedBox
                    width={"100%"}
                    isOpen={isShowMore}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"16px"}
                  >
                    <MyCustomButton
                      iconPosition="left"
                      icon={<ManageAccounts sx={{ color: "#8B4513" }} />}
                      width="100%"
                      onClick={() =>
                        navigate(
                          user?.role.roleName === "Staff"
                            ? ROUTES.admin.managemotorbikes
                            : ROUTES.admin.dashboard
                        )
                      }
                      content={t("header.dashboard")}
                      variant="outlined"
                    />
                    <MyCustomButton
                      iconPosition="left"
                      icon={
                        <NotificationsActiveOutlined
                          sx={{ color: "#8B4513" }}
                        />
                      }
                      width="100%"
                      onClick={(e) => {
                        setDrawerOpenNoti(true);
                      }}
                      content={t("header.notification")}
                      variant="outlined"
                    />
                  </AnimatedBox>
                ) : (
                  // list customer
                  <AnimatedBox
                    width={"100%"}
                    isOpen={isShowMore}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"16px"}
                  >
                    <MyCustomButton
                      iconPosition="left"
                      icon={<ListAlt sx={{ color: "#8B4513" }} />}
                      width="100%"
                      onClick={() => navigate(ROUTES.user.listmotorbike)}
                      content={t("header.mylistmotorbike")}
                      variant="outlined"
                    />
                    <MyCustomButton
                      iconPosition="left"
                      icon={
                        <MarkunreadMailboxOutlined sx={{ color: "#8B4513" }} />
                      }
                      width="100%"
                      onClick={() => navigate(ROUTES.booking.mybooking)}
                      content={t("header.my_booking")}
                      variant="outlined"
                    />
                    <MyCustomButton
                      iconPosition="left"
                      icon={
                        <NotificationsActiveOutlined
                          sx={{ color: "#8B4513" }}
                        />
                      }
                      width="100%"
                      onClick={(e) => {
                        setDrawerOpenNoti(true);
                      }}
                      content={t("header.notification")}
                      variant="outlined"
                    />
                    <MyCustomButton
                      iconPosition="left"
                      icon={<FavoriteIcon sx={{ color: "#8B4513" }} />}
                      width="100%"
                      onClick={() => navigate(ROUTES.user.favourite)}
                      content={t("header.favourite")}
                      variant="outlined"
                    />
                    <MyCustomButton
                      iconPosition="left"
                      icon={<WalletOutlined sx={{ color: "#8B4513" }} />}
                      width="100%"
                      onClick={() => navigate(ROUTES.user.wallet)}
                      content={t("header.wallet")}
                      variant="outlined"
                    />
                    <MyCustomButton
                      iconPosition="left"
                      icon={<Loyalty sx={{ color: "#8B4513" }} />}
                      width="100%"
                      onClick={() => navigate(ROUTES.user.listmotorbike)}
                      content={t("header.btn_promotion")}
                      variant="outlined"
                    />
                  </AnimatedBox>
                )}
                <Box
                  width={"100%"}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    alignItems: "center",
                    padding: "0px 16px",
                  }}
                >
                  <MyIcon
                    icon={<LanguageBox />}
                    hasTooltip
                    tooltipText={isVn ? "Tiếng Việt" : "English"}
                    position="left"
                  />
                  <Typography
                    variant="h3"
                    fontSize={"16px"}
                    sx={{ fontWeight: "500" }}
                  >
                    {isVn ? "Tiếng Việt" : "English"}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginBottom: "16px",
                    borderBottom: "1px solid #B1B5C3",
                    width: "100%",
                  }}
                />
                <MyCustomButton
                  iconPosition="left"
                  icon={<Home sx={{ color: "#8B4513" }} />}
                  width="100%"
                  onClick={() => navigate(ROUTES.homepage)}
                  content={t("header.home_page")}
                  variant="outlined"
                />
                <MyCustomButton
                  iconPosition="left"
                  icon={<VpnKey sx={{ color: "#8B4513" }} />}
                  width="100%"
                  onClick={() => navigate(ROUTES.user.previewbecomeanowner)}
                  content={t("header.registermotorbike")}
                  variant="outlined"
                />
                <MyCustomButton
                  iconPosition="left"
                  icon={<ExitToApp sx={{ color: "#fff" }} />}
                  width="100%"
                  onClick={() => {
                    setAnchorEl(null);
                    UserService.logout();
                    logout();
                  }}
                  content={t("header.logout")}
                />
              </Box>
            </Box>
          ) : (
            <Box
              height={"100%"}
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{}}
            >
              {/* header */}
              <Box
                height={"10%"}
                width={"90%"}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 16px",
                }}
              >
                <LogoFull size={150} />
                <MyIcon
                  icon={<Close />}
                  hasTooltip
                  tooltipText={t("header.btn_close")}
                  position="bottom"
                />
              </Box>
              {/* content */}
              <Box
                height={"90%"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                  padding: "32px",
                  gap: "16px",
                }}
              >
                <MyCustomButton
                  width="100%"
                  onClick={() => navigate(ROUTES.account.login)}
                  content={t("header.login")}
                />
                <MyCustomButton
                  width="100%"
                  onClick={() => navigate(ROUTES.account.register)}
                  content={t("header.register")}
                  variant="outlined"
                />
                <Box
                  width={"100%"}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    alignItems: "center",
                    padding: "0px 16px",
                  }}
                >
                  <MyIcon
                    icon={<LanguageBox />}
                    hasTooltip
                    tooltipText={isVn ? "Tiếng Việt" : "English"}
                    position="left"
                  />
                  <Typography
                    variant="h3"
                    fontSize={"16px"}
                    sx={{ fontWeight: "500" }}
                  >
                    {isVn ? "Tiếng Việt" : "English"}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    marginBottom: "16px",
                    borderBottom: "1px solid #B1B5C3",
                    width: "100%",
                  }}
                />
                <MyCustomButton
                  iconPosition="left"
                  icon={<Home sx={{ color: "#8B4513" }} />}
                  width="100%"
                  onClick={() => navigate(ROUTES.homepage)}
                  content={t("header.home_page")}
                  variant="outlined"
                />
                <MyCustomButton
                  iconPosition="left"
                  icon={<VpnKey sx={{ color: "#8B4513" }} />}
                  width="100%"
                  onClick={() => ROUTES.user.previewbecomeanowner}
                  content={t("header.registermotorbike")}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Notification */}
      <Drawer
        sx={{ "& .MuiDrawer-paper": { width: "100%" } }}
        anchor="left"
        open={drawerOpenNoti}
        onClose={toggleDrawerNoti}
      >
        <Box
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              fontWeight={"700"}
              fontSize={"24px"}
              style={{ padding: "16px" }}
            >
              {t("notification.title")}
            </Typography>
            <CloseOutlined
              style={{ padding: "16px" }}
              onClick={() => setDrawerOpenNoti(false)}
            />
          </Box>
          <Divider />
          {userNotification.length > 0 ? (
            userNotification.map((notifi) => {
              return (
                <MenuItem
                  sx={{
                    textAlign: "center",
                    borderRadius: "16px",
                  }}
                  key={`NOTIFI${notifi.notificationId}`}
                  onClick={() => {
                    setContentModal(
                      <DetailNotification id={notifi.notificationId} />
                    );
                  }}
                >
                  <PopoverItem
                    label={notifi.title}
                    icon={
                      <img width={48} height={48} src={notifi.category.image} />
                    }
                    iconRead={!notifi.isRead ? <UnReadIcon /> : undefined}
                    content={notifi.detail}
                    timeAgo={notifi.createDatetime}
                  />
                </MenuItem>
              );
            })
          ) : (
            <Typography pt={"8px"}>{t("notification.empty")}</Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Header;

export function PopoverItem({
  label,
  icon,
  iconRead,
  timeAgo,
  content,
}: {
  label: string;
  icon: any;
  iconRead?: any;
  timeAgo?: string;
  content?: string;
}) {
  const { t } = usei18next();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "8px 0px",
        gap: "8px",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {icon}
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
        sx={{
          width: "80%",
          gap: "4px",
        }}
      >
        <Typography
          variant="h4"
          fontSize={"16px"}
          sx={{
            fontWeight: "500",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "start",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "start",
          }}
          fontSize={"12px"}
        >
          {content}
        </Typography>
        <Typography fontSize={"10px"} color={"primary.main"}>
          {timeAgo ? getPreviousTimeRelative(timeAgo, t) : ""}
        </Typography>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        {iconRead}
      </Box>
    </Box>
  );
}
