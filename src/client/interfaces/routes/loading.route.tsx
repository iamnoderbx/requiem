import Roact from "@rbxts/roact";
import { Memory } from "shared/utilities/memory.utilities";
import { useStateSelector } from "../management/InterfaceSelector";
import { useEffect, useRef } from "@rbxts/roact-hooked";
import { TweenService } from "@rbxts/services";

export const LoadingSpinnerSubscription : unique symbol = {} as never

export const LoadingSubscription = Memory.createEmptySubscription("loading");
LoadingSubscription.set(false);

export default function LoadingSpinnerComponent(): Roact.Element {
    // A selector that returns the player's enchantments.
    const isPlayerLoading = useStateSelector(LoadingSubscription, (state) => {
        return state.get();
    });

    const ref = useRef<Frame>();

    useEffect(() => {
        if(!ref.getValue()) return

        const frame = ref.getValue() as Frame & {UIScale: UIScale};
        
        if(isPlayerLoading) frame.UIScale.Scale = 0.8;
        TweenService.Create(frame.UIScale, new TweenInfo(0.2), {Scale: 1}).Play();
        
    }, [ isPlayerLoading, ref ])

    return (
        <frame
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.5, 0.5)}
            Size={UDim2.fromOffset(294, 294)}
            ZIndex={150}
            Key={"loading"}
            Visible={(isPlayerLoading as boolean) ?? false}
            Ref={ref}
        >
            <uiscale Key={"UIScale"} Scale={1}/>
            <imagelabel
                Image={"rbxassetid://16255699706"}
                ImageColor3={Color3.fromRGB(149, 197, 255)}
                ImageTransparency={0.98}
                ScaleType={Enum.ScaleType.Crop}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(31, 33, 39)}
                BackgroundTransparency={0.1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.5, 0.5)}
                Size={UDim2.fromScale(1, 1)}
                Key={"menu"}
            >
                <uicorner
                    Key={"UICorner"}
                    CornerRadius={new UDim(0, 20)}
                />
            </imagelabel>

            <imagelabel
                Image={"rbxassetid://16264499577"}
                ScaleType={Enum.ScaleType.Slice}
                SliceCenter={new Rect(379, 379, 379, 379)}
                SliceScale={0.1}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.502, 0.496)}
                Size={new UDim2(0.944, 50, 0.931, 50)}
                ZIndex={0}
                Key={"shadow"}
            />

            <textlabel
                FontFace={new Font(
                    "rbxasset://fonts/families/SourceSansPro.json",
                    Enum.FontWeight.SemiBold,
                    Enum.FontStyle.Normal
                )}
                Text={"Loading"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.24}
                TextWrapped={true}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.188, 0.653)}
                Size={UDim2.fromScale(0.621, 0.0973)}
                ZIndex={2}
                Key={"header"}
            />

            <textlabel
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={"Please wait while we load your request!"}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.24}
                TextWrapped={true}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.188, 0.772)}
                Size={UDim2.fromScale(0.621, 0.114)}
                ZIndex={2}
                Key={"body"}
            />

            <imagelabel
                Image={"rbxassetid://11963352805"}
                ImageColor3={Color3.fromRGB(66, 70, 80)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.497, 0.367)}
                Size={UDim2.fromOffset(136, 136)}
                ZIndex={57}
                Key={"loading"}
            />
        </frame>
    )
}