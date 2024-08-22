import { useAsyncEffect, useBindingListener, useBindingState, useMountEffect } from "@rbxts/pretty-roact-hooks";
import Roact, { createBinding } from "@rbxts/roact";
import { useEffect, useMemo, useMutable, useRef, useState, withHooks } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";

// A map of instances to their transparencies.

export const getTransparencyProperty = (instance: Instance): (string | number)[][] | undefined => {
    const results = [];

    if (instance.IsA("TextLabel") || instance.IsA("TextButton") || instance.IsA("TextBox")) {
        results.push(["TextTransparency", instance.TextTransparency]);
    }

    if (instance.IsA("ImageLabel") || instance.IsA("ImageButton") || instance.IsA("ViewportFrame")) {
        results.push(["ImageTransparency", instance.ImageTransparency]);
    }

    if (instance.IsA("GuiObject")) {
        results.push(["BackgroundTransparency", instance.BackgroundTransparency]);
    }

    if (instance.IsA("UIStroke")) {
        results.push(["Transparency", instance.Transparency]);
    }

    if (results.size() === 0) return;
    return results;
}

export function useTransparencyGroup({ visible, tween, delay }: { visible: boolean, tween?: TweenInfo, delay?: number }) {
    const value = useMutable(visible ? 0 : 1);
    const [transparency, setTransparency] = createBinding(value.current);

    useAsyncEffect(async () => {
        if (visible) {
            value.current = 0;
            return setTransparency(0);
        }

        Promise.delay((tween?.Time || 0) + (delay || 0)).await();

        setTransparency(1);
        value.current = visible ? 0 : 1;
    })

    return $tuple(transparency, { visible, tween, delay });
}

function TransparencyGroup(props: {
    visible: boolean,
    settings: {
        tween: TweenInfo | undefined;
        delay: number | undefined
    },
    zindex?: number,
    size?: UDim2,
    position?: UDim2
} & Roact.PropsWithChildren): Roact.Element {

    const ref = useRef<Frame>();
    const [isMounted, setMountedPending] = useState(0);

    //const transparencies : Map<Instance, (string | number)[][]> = new Map();
    const transparencies = useMutable(new Map<Instance, (string | number)[][]>([]));
    const connections = useMutable<Map<Instance, RBXScriptConnection>>(new Map());

    const thread = useMutable<thread>();

    useEffect(() => {
        if (!ref.getValue()) return;
        if (!isMounted) return;

        const addTransparencyToCache = (instance: Instance): void => {
            const transparencyProperty = getTransparencyProperty(instance);
            if (!transparencyProperty) return;

            transparencies.current.set(instance, transparencyProperty)

            let newInstance: Partial<Instance> = instance; // This creates a copy of the Instance object

            const mutableInstance = (newInstance as Record<string, number>)

            // for(const [property, value] of transparencies.current.get(instance)!) {
            //     if(props.visible) mutableInstance[property as keyof Instance] = 1;
            //     else mutableInstance[property as keyof Instance] = tonumber(value)!;
            // }
        }

        const frame = ref.getValue();
        if (isMounted === 1 && frame) {
            // Initialize all transparencies of the frame.
            setMountedPending(2);

            for (const instance of frame.GetDescendants()) {
                addTransparencyToCache(instance);
            }

            if (connections.current.get(frame)) connections.current.get(frame)!.Disconnect();
            const connection = frame.DescendantAdded.Connect((instance) => {
                addTransparencyToCache(instance);
            })

            connections.current.set(frame, connection);
        } else if (isMounted === 2 && frame) {
            if (thread.current) coroutine.close(thread.current);

            thread.current = coroutine.create(() => {
                if (!frame) return;
                if (props.settings.delay) Promise.delay(props.settings.delay).await();

                if (connections.current.get(frame)) connections.current.get(frame)!.Disconnect();
                const connection = frame.DescendantAdded.Connect((instance) => {
                    addTransparencyToCache(instance);
                })

                connections.current.set(frame, connection);

                // Set the transparency of the frame.
                for (const instance of frame.GetDescendants()) {
                    const transparencyProperty = getTransparencyProperty(instance);
                    if (!transparencyProperty) continue;

                    let cached = transparencies.current.get(instance);
                    if (!cached) addTransparencyToCache(instance);

                    cached = transparencies.current.get(instance)!;
                    if (!cached) continue;

                    let newInstance: Partial<Instance> = instance; // This creates a copy of the Instance object
                    const mutableInstance = (newInstance as Record<string, number>)

                    // Add the tween support.
                    if (props.visible) {
                        frame.Visible = true;
                        for (const [property, value] of cached!) {
                            if (props.settings.tween) TweenService.Create(instance, props.settings.tween, { [property]: value }).Play();
                            else mutableInstance[property as keyof Instance] = tonumber(value)!;
                        }

                    } else {
                        for (const [property, value] of cached!) {
                            if (props.settings.tween) {
                                const tween = TweenService.Create(instance, props.settings.tween, { [property]: 1 })
                                tween.Play();

                                tween.Completed.Connect(() => {
                                    frame.Visible = false;
                                })
                            }
                            else mutableInstance[property as keyof Instance] = 1;
                        }
                    }
                }
            })

            coroutine.resume(thread.current);
        }

    }, [ref, props.visible, isMounted]);

    useMountEffect(() => {
        setMountedPending(1);
    })

    return (
        <frame
            BackgroundTransparency={1}
            Size={props.size ?? new UDim2(1, 0, 1, 0)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={props.position ?? new UDim2(0.5, 0, 0.5, 0)}
            Ref={ref}
            ZIndex={props.zindex || 0}
        >
            {props[Roact.Children]}
        </frame>
    )
}

export default (TransparencyGroup);