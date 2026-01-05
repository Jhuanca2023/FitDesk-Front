'use client';

import { Monitor, Moon, Sun } from 'lucide-react';

import {
    ThemeToggler as ThemeTogglerPrimitive,
    type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
    type ThemeSelection,
    type Resolved,
} from './effects/theme-toggler';
import { buttonVariants } from '../ui/button';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/core/lib/utils';
import { useTheme } from '@/core/providers/theme-provider';
import { useSidebar } from '@/shared/components/animated/sidebar';

const getIcon = (
    effective: ThemeSelection,
    resolved: Resolved,
    modes: ThemeSelection[],
    showText: boolean,
) => {
    const theme = modes.includes('system') ? effective : resolved;

    const IconNode =
        theme === 'system' ? (
            <Monitor />
        ) : theme === 'dark' ? (
            <Moon />
        ) : (
            <Sun />
        );

    if (showText) {
        return (
            <div className="flex items-center gap-3">
                {IconNode}
                <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
            </div>
        );
    }

    return IconNode;
};

const getNextTheme = (
    effective: ThemeSelection,
    modes: ThemeSelection[],
): ThemeSelection => {
    const i = modes.indexOf(effective);
    if (i === -1) return modes[0];
    return modes[(i + 1) % modes.length];
};

type ThemeTogglerButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        modes?: ThemeSelection[];
        onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
        direction?: ThemeTogglerPrimitiveProps['direction'];
        showLabel?: boolean | 'auto';
    };

function ThemeTogglerButton({
    variant = 'default',
    size = 'default',
    // modes = ['light', 'dark', 'system'],
    modes = ['light', 'dark'],
    direction = 'ltr',
    onImmediateChange,
    onClick,
    className,
    showLabel = 'auto',
    ...props
}: ThemeTogglerButtonProps) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    let isCollapsed = false;
    try {
        // biome-ignore lint/correctness/useHookAtTopLevel: <>
        const ctx = useSidebar();
        isCollapsed = ctx?.state === 'collapsed';
    } catch {
        isCollapsed = false;
    }

    const shouldShowLabel = showLabel === 'auto' ? !isCollapsed : Boolean(showLabel);

    return (
        <ThemeTogglerPrimitive
            theme={theme as ThemeSelection}
            resolvedTheme={resolvedTheme as Resolved}
            setTheme={setTheme}
            direction={direction}
            onImmediateChange={onImmediateChange}
        >
            {({ effective, resolved, toggleTheme }) => (
                <button
                    data-slot="theme-toggler-button"
                    className={cn(
                        buttonVariants({
                            variant,
                            size: shouldShowLabel ? size : 'icon',
                        }),
                        'cursor-pointer',
                        className,
                    )}
                    onClick={(e) => {
                        onClick?.(e);
                        toggleTheme(getNextTheme(effective, modes));
                    }}
                    aria-label={
                        shouldShowLabel
                            ? undefined
                            : resolved === 'dark'
                                ? 'Activar modo claro'
                                : 'Activar modo oscuro'
                    }
                    {...props}
                >
                    {getIcon(effective, resolved, modes, shouldShowLabel)}
                    {!shouldShowLabel && (
                        <span className="sr-only">
                            {resolved === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                        </span>
                    )}
                </button>
            )}
        </ThemeTogglerPrimitive>
    );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };