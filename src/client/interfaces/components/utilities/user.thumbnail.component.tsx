
import { useAsyncEffect } from "@rbxts/pretty-roact-hooks";
import Roact from "@rbxts/roact";
import {useState, withHooks } from "@rbxts/roact-hooked";
import { Players } from "@rbxts/services";

function UserThumbnailComponent(props: { UserId?: number } & Roact.JsxInstanceProperties<ImageLabel>): Roact.Element {
    const userId = props.UserId;
    props.UserId = undefined;

    const [headshotUrl, setHeadshotUrl] = useState(""); // State to hold the headshot URL

    useAsyncEffect(async () => {
        if (!userId || !props.Visible) return;

        const [headshot, isReady] = Players.GetUserThumbnailAsync(userId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size420x420) as LuaTuple<[string, boolean]>;
        if (isReady) {
            setHeadshotUrl(headshot); // Update state with the fetched headshot URL
        };

    }, [userId, props.Visible]);
    
    return <imagelabel
        Key={"ImageLabel1"}
        Image={headshotUrl}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.9}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0.487, 0.311)}
        Size={UDim2.fromScale(0.781, 0.55)}
        {...props}
    />
}

export default withHooks(UserThumbnailComponent);