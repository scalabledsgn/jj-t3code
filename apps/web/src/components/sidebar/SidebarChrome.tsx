import {
  ArrowLeftIcon,
  ChartNoAxesColumnIcon,
  GitPullRequestIcon,
  SettingsIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { memo, useCallback } from "react";
import { Link, useCanGoBack, useLocation, useNavigate } from "@tanstack/react-router";

import { useEnvironmentIdentificationMode } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";
import { useEnvironments } from "../../state/environments";
import {
  resolveEnvironmentIdentificationPillLabel,
  resolveSidebarStageBackdropVariant,
  resolveSidebarStageFocusRingOffsetClass,
  SidebarStageBackdrop,
  useEnvironmentStageLabel,
} from "../SidebarStageBackdrop";
import { Badge } from "../ui/badge";
import {
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { Tooltip, TooltipPopup, TooltipTrigger } from "../ui/tooltip";
import { readPullRequestListPreferences } from "../pullRequest/pullRequestListPreferences";
import { SidebarProviderUpdatePill } from "./SidebarProviderUpdatePill";
import { SidebarUpdateArchitectureWarning, SidebarUpdatePill } from "./SidebarUpdatePill";

export const SidebarChromeHeader = memo(function SidebarChromeHeader({
  isElectron,
}: {
  isElectron: boolean;
}) {
  const stageLabel = useEnvironmentStageLabel();
  const environmentIdentificationMode = useEnvironmentIdentificationMode();
  const backdropVariant = resolveSidebarStageBackdropVariant(
    stageLabel,
    environmentIdentificationMode === "artwork",
  );
  const pillLabel =
    environmentIdentificationMode === "pill"
      ? resolveEnvironmentIdentificationPillLabel(stageLabel)
      : null;

  return (
    <SidebarHeader
      className={cn(
        "@container/sidebar-header relative h-[var(--workspace-topbar-height)] shrink-0 flex-row items-center px-3 py-0 md:px-0",
        isElectron && "drag-region",
      )}
    >
      {backdropVariant ? <SidebarStageBackdrop variant={backdropVariant} /> : null}
      <SidebarTrigger
        className={cn(
          "relative z-10 md:hidden",
          backdropVariant &&
            "focus-visible:ring-white/90 [&_svg]:stroke-white/90! [&_svg]:opacity-100! [&_svg]:hover:stroke-white! [:hover,[data-pressed]]:bg-white/15",
          backdropVariant && resolveSidebarStageFocusRingOffsetClass(backdropVariant),
        )}
      />
      <SidebarBrand onBackdrop={backdropVariant !== null} />
      {pillLabel ? (
        <Badge
          className="relative z-10 ml-1 hidden rounded-full px-1.5 text-muted-foreground @[15rem]/sidebar-header:inline-flex"
          data-environment-identification="pill"
          size="sm"
          variant="secondary"
        >
          {pillLabel}
        </Badge>
      ) : null}
    </SidebarHeader>
  );
});

function SidebarBrand({ onBackdrop }: { onBackdrop: boolean }) {
  return (
    <Link
      aria-label="Go to threads"
      className={cn(
        "relative z-10 ml-[var(--workspace-titlebar-content-left)] hidden h-7 w-fit min-w-0 shrink-0 items-center overflow-hidden rounded-md outline-hidden ring-ring focus-visible:ring-2 md:flex",
        onBackdrop ? "text-white" : "text-foreground",
      )}
      to="/"
    >
      <span className="inline-flex min-w-0 items-baseline gap-1">
        <ScalableWordmark />
        <span
          className={cn(
            "truncate text-sm font-medium tracking-tight",
            onBackdrop ? "text-white/70" : "text-muted-foreground",
          )}
        >
          Code
        </span>
      </span>
    </Link>
  );
}

function ScalableWordmark() {
  return (
    <svg
      aria-label="SCALABLE"
      className="h-2.5 w-auto shrink-0"
      viewBox="0 0 682 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M87.0015 63.4111L66.8081 66.9968C64.166 55.8621 55.1073 50.5779 44.9162 50.5779C34.159 50.5779 26.7987 55.296 26.7987 63.9772C26.7987 72.0923 34.9138 74.1683 45.2936 76.0555L55.296 77.5653C72.6585 80.5849 89.4549 85.8691 89.4549 107.572C89.4549 128.709 70.5826 139.089 45.8598 139.089C20.0047 139.089 3.39704 126.445 1.62147e-05 107.761L20.3821 104.175C23.4017 117.386 32.8379 123.236 46.2373 123.236C58.3156 123.236 66.8081 117.763 66.8081 108.327C66.8081 100.212 58.5043 97.3813 46.8034 95.3053L36.4236 93.6068C20.7596 90.9647 4.34065 85.4917 4.34065 64.5434C4.34065 46.8034 21.7032 34.7251 44.9162 34.7251C67.3743 34.7251 84.3594 47.5583 87.0015 63.4111ZM146.068 121.727C162.675 121.727 168.337 109.46 170.413 101.156L192.871 104.175C188.908 119.084 176.263 139.089 146.068 139.089C116.815 139.089 97.943 118.518 97.943 86.8128C97.943 55.296 116.815 34.7251 146.068 34.7251C176.075 34.7251 187.587 54.3523 190.984 64.3547L169.847 70.2051C167.771 63.9772 162.109 52.0877 146.068 52.0877C130.403 52.0877 120.401 64.7321 120.401 86.8128C120.401 108.893 130.403 121.727 146.068 121.727ZM290.071 136.636L268.556 136.824C266.858 134.937 265.537 130.03 265.537 123.236C259.12 134.182 244.777 139.089 232.321 139.089C214.393 139.089 199.106 127.766 199.106 109.271C199.106 87.7564 214.581 79.83 241.191 76.9991C260.441 74.9232 265.348 71.7149 265.348 65.6757C265.348 57.3719 259.686 51.7102 245.91 51.7102C236.096 51.7102 226.66 56.8057 223.263 67.7517L202.881 63.7885C207.221 45.6711 224.206 34.7251 246.476 34.7251C276.105 34.7251 287.429 48.3132 287.429 65.8645V115.876C287.429 126.822 287.617 132.295 290.071 136.636ZM265.348 97.57V86.2466C262.14 89.4549 251.571 90.9647 241.003 92.2857C231 93.7955 221.753 98.5136 221.753 108.893C221.753 117.763 227.792 122.481 237.606 122.481C249.684 122.481 265.348 115.499 265.348 97.57ZM302.039 -9.18756e-06L324.119 -9.18756e-06V136.636H302.039V-9.18756e-06ZM426.822 136.636L405.307 136.824C403.609 134.937 402.288 130.03 402.288 123.236C395.871 134.182 381.528 139.089 369.072 139.089C351.143 139.089 335.857 127.766 335.857 109.271C335.857 87.7564 351.332 79.83 377.942 76.9991C397.192 74.9232 402.099 71.7149 402.099 65.6757C402.099 57.3719 396.437 51.7102 382.66 51.7102C372.847 51.7102 363.411 56.8057 360.013 67.7517L339.631 63.7885C343.972 45.6711 360.957 34.7251 383.226 34.7251C412.856 34.7251 424.179 48.3132 424.179 65.8645V115.876C424.179 126.822 424.368 132.295 426.822 136.636ZM402.099 97.57V86.2466C398.891 89.4549 388.322 90.9647 377.753 92.2857C367.751 93.7955 358.504 98.5136 358.504 108.893C358.504 117.763 364.543 122.481 374.356 122.481C386.435 122.481 402.099 115.499 402.099 97.57ZM491.254 34.7251C517.11 34.7251 535.793 55.296 535.793 86.8128C535.793 118.518 517.11 139.089 491.066 139.089C477.289 139.089 465.777 133.616 460.304 123.991H459.549V136.636L438.412 136.636V-9.18756e-06L460.492 -9.18756e-06V48.5019H461.247C466.72 40.1981 477.289 34.7251 491.254 34.7251ZM486.159 121.538C502.767 121.538 513.335 108.893 513.335 86.8128C513.335 64.9208 502.767 52.0877 486.159 52.0877C469.74 52.0877 459.171 64.9208 459.171 86.8128C459.171 108.893 469.74 121.538 486.159 121.538ZM548.264 -9.18756e-06L570.344 -9.18756e-06V136.636H548.264V-9.18756e-06ZM655.495 105.119L677.953 107.384C673.802 121.727 661.157 139.089 630.961 139.089C601.898 139.089 582.837 118.33 582.837 87.0015C582.837 55.4847 601.143 34.7251 630.773 34.7251C660.591 34.7251 681.35 55.6734 678.708 91.9083L605.295 91.9083C605.672 109.271 615.486 122.104 630.961 122.104C647.192 122.104 653.419 111.913 655.495 105.119ZM630.773 51.5215C615.109 51.5215 606.993 63.0336 605.672 76.2442H656.25C654.929 63.0336 646.814 51.5215 630.773 51.5215Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SidebarUtilityItem({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <SidebarMenuItem className="shrink-0">
      <Tooltip>
        <TooltipTrigger
          render={
            <SidebarMenuButton aria-label={label} onClick={onClick} size="icon">
              {icon}
            </SidebarMenuButton>
          }
        />
        <TooltipPopup side="top">{label}</TooltipPopup>
      </Tooltip>
    </SidebarMenuItem>
  );
}

export const SidebarUtilityMenu = memo(function SidebarUtilityMenu() {
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const { isMobile, setOpenMobile } = useSidebar();
  const currentFooterPage = useLocation({
    select: (location) =>
      /^\/settings(?:\/|$)/.test(location.pathname)
        ? "settings"
        : /^\/projects\/[^/]+\/?$/.test(location.pathname)
          ? "project-settings"
          : location.pathname === "/usage"
            ? "usage"
            : location.pathname === "/pull-requests"
              ? "pull-requests"
              : null,
  });
  const { environments } = useEnvironments();
  // The page reads every connected server, so one of them offering pull requests is enough for
  // the link to lead somewhere.
  const pullRequestsSupported = environments.some(
    (environment) => environment.serverConfig?.environment.capabilities.pullRequests === true,
  );
  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);
  const handlePullRequestsClick = useCallback(() => {
    closeMobileSidebar();
    void navigate({
      to: "/pull-requests",
      search: readPullRequestListPreferences(),
    });
  }, [closeMobileSidebar, navigate]);
  const handleSettingsClick = useCallback(() => {
    closeMobileSidebar();
    void navigate({ to: "/settings" });
  }, [closeMobileSidebar, navigate]);

  const handleUsageClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
    void navigate({ to: "/usage" });
  }, [isMobile, navigate, setOpenMobile]);

  const handleBackClick = useCallback(() => {
    closeMobileSidebar();
    if (canGoBack) {
      window.history.back();
      return;
    }
    void navigate({ to: "/" });
  }, [canGoBack, closeMobileSidebar, navigate]);

  return (
    <SidebarMenu className="flex-row items-center">
      {currentFooterPage ? (
        <SidebarMenuItem className="min-w-0 flex-1">
          <SidebarMenuButton onClick={handleBackClick}>
            <ArrowLeftIcon />
            <span>Back</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ) : (
        <>
          <SidebarUtilityItem
            icon={<SettingsIcon />}
            label="Settings"
            onClick={handleSettingsClick}
          />
          {pullRequestsSupported ? (
            <SidebarUtilityItem
              icon={<GitPullRequestIcon />}
              label="Pull Requests"
              onClick={handlePullRequestsClick}
            />
          ) : null}
          <SidebarUtilityItem
            icon={<ChartNoAxesColumnIcon />}
            label="Usage"
            onClick={handleUsageClick}
          />
        </>
      )}
      <SidebarUpdatePill />
    </SidebarMenu>
  );
});

export const SidebarChromeFooter = memo(function SidebarChromeFooter() {
  return (
    <SidebarFooter className="p-[var(--sidebar-content-inset)]">
      <SidebarProviderUpdatePill />
      <SidebarUpdateArchitectureWarning />
      <SidebarUtilityMenu />
    </SidebarFooter>
  );
});
