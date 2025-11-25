import { useState } from "react";

// material-ui
import {
  Avatar,
  AvatarGroup,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";

// project imports
import MainCard from "components/MainCard";
import AnalyticEcommerce from "components/cards/statistics/AnalyticEcommerce";
import MonthlyBarChart from "sections/dashboard/default/MonthlyBarChart";
import ReportAreaChart from "sections/dashboard/default/ReportAreaChart";
import UniqueVisitorCard from "sections/dashboard/default/UniqueVisitorCard";
import SaleReportCard from "sections/dashboard/default/SaleReportCard";
import OrdersTable from "sections/dashboard/default/OrdersTable";

// ant-design icons (named imports!)
import {
  EllipsisOutlined,
  GiftOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// avatars
import avatar1 from "assets/images/users/avatar-1.png";
import avatar2 from "assets/images/users/avatar-2.png";
import avatar3 from "assets/images/users/avatar-3.png";
import avatar4 from "assets/images/users/avatar-4.png";

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

export default function DashboardDefault() {
  const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
  const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);

  const handleOrderMenuClick = (event) =>
    setOrderMenuAnchor(event.currentTarget);
  const handleOrderMenuClose = () => setOrderMenuAnchor(null);

  const handleAnalyticsMenuClick = (event) =>
    setAnalyticsMenuAnchor(event.currentTarget);
  const handleAnalyticsMenuClose = () => setAnalyticsMenuAnchor(null);

  return (
    <Grid container spacing={3}>
      {/* Row 1: Header */}
      <Grid item sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      {/* Row 2: Analytics Cards */}
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Page Views"
          count="4,42,236"
          percentage={59.3}
          extra="35,000"
        />
      </Grid>
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Users"
          count="78,250"
          percentage={70.5}
          extra="8,900"
        />
      </Grid>
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Order"
          count="18,800"
          percentage={27.4}
          isLoss
          color="warning"
          extra="1,943"
        />
      </Grid>
      <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Sales"
          count="35,078"
          percentage={27.4}
          isLoss
          color="warning"
          extra="20,395"
        />
      </Grid>

      {/* Row 3: Visitor & Income */}
      <Grid item size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard />
      </Grid>
      <Grid item size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Income Overview</Typography>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">$7,650</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>

      {/* Row 4: Recent Orders & Analytics */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Recent Orders</Typography>
          <IconButton onClick={handleOrderMenuClick}>
            <EllipsisOutlined style={{ fontSize: "1.25rem" }} />
          </IconButton>
          <Menu
            anchorEl={orderMenuAnchor}
            open={Boolean(orderMenuAnchor)}
            onClose={handleOrderMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleOrderMenuClose}>Export as CSV</MenuItem>
            <MenuItem onClick={handleOrderMenuClose}>Export as Excel</MenuItem>
            <MenuItem onClick={handleOrderMenuClose}>Print Table</MenuItem>
          </Menu>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Analytics Report</Typography>
          <IconButton onClick={handleAnalyticsMenuClick}>
            <EllipsisOutlined style={{ fontSize: "1.25rem" }} />
          </IconButton>
          <Menu
            anchorEl={analyticsMenuAnchor}
            open={Boolean(analyticsMenuAnchor)}
            onClose={handleAnalyticsMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleAnalyticsMenuClose}>Weekly</MenuItem>
            <MenuItem onClick={handleAnalyticsMenuClose}>Monthly</MenuItem>
            <MenuItem onClick={handleAnalyticsMenuClose}>Yearly</MenuItem>
          </Menu>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, "& .MuiListItemButton-root": { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid>

      {/* Row 5: Sale Report & Transaction History */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Typography variant="h5">Transaction History</Typography>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              "& .MuiListItemButton-root": {
                py: 1.5,
                px: 2,
                "& .MuiAvatar-root": avatarSX,
                "& .MuiListItemSecondaryAction-root": {
                  ...actionSX,
                  position: "relative",
                },
              },
            }}
          >
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: "flex-end" }}>
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ color: "success.main", bgcolor: "success.lighter" }}
                >
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Order #002434</Typography>
                }
                secondary="Today, 2:00 AM"
              />
            </ListItem>
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: "flex-end" }}>
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ color: "primary.main", bgcolor: "primary.lighter" }}
                >
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Order #984947</Typography>
                }
                secondary="5 August, 1:45 PM"
              />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: "flex-end" }}>
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: "error.main", bgcolor: "error.lighter" }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Order #988784</Typography>
                }
                secondary="7 hours ago"
              />
            </ListItem>
          </List>
        </MainCard>

        <MainCard sx={{ mt: 2 }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Stack>
                <Typography variant="h5">Help & Support Chat</Typography>
                <Typography variant="caption" color="secondary">
                  Typical reply within 5 min
                </Typography>
              </Stack>
              <AvatarGroup
                sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
              >
                <Avatar alt="Remy Sharp" src={avatar1} />
                <Avatar alt="Travis Howard" src={avatar2} />
                <Avatar alt="Cindy Baker" src={avatar3} />
                <Avatar alt="Agnes Walker" src={avatar4} />
              </AvatarGroup>
            </Grid>
            <Button
              size="small"
              variant="contained"
              sx={{ textTransform: "capitalize" }}
            >
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
