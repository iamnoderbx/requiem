import Roact from "@rbxts/roact";
import { markPureComponent } from "@rbxts/roact-hooked";
import { Workspace } from "@rbxts/services";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { Tooltip } from "client/interfaces/routes/tooltips.route";

export function ParagraphRedirectListComponent(props: { title: string, description: string, onClick: () => void, locked?: boolean }) {
    return (
        <frame
            Key={"bottom"}
            BackgroundColor3={Color3.fromRGB(0, 0, 0)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0, 0.598)}
            Size={UDim2.fromScale(1, 0.2)}
            ZIndex={16}
        >
            <frame
                Key={"frame"}
                AnchorPoint={new Vector2(0, 1)}
                BackgroundColor3={Color3.fromRGB(21, 22, 25)}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0, 1)}
                Size={UDim2.fromScale(1, 1.26)}
            >
                <uicorner
                    Key={"uICorner"}
                    CornerRadius={new UDim(0, 10)}
                />

                <uigradient
                    Key={"uIGradient"}
                    Rotation={270}
                    Transparency={new NumberSequence([
                        new NumberSequenceKeypoint(0, 0),
                        new NumberSequenceKeypoint(0.799, 0),
                        new NumberSequenceKeypoint(0.8, 1),
                        new NumberSequenceKeypoint(1, 1),
                    ])}
                />
            </frame>

            <textlabel
                Key={"textLabel"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.title}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.28}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0297, 0.254)}
                Size={UDim2.fromScale(0.735, 0.226)}
                ZIndex={16}
            />

            <textlabel
                Key={"textLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.description}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={30}
                TextTransparency={0.65}
                TextTruncate={Enum.TextTruncate.AtEnd}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Interactable={false}
                Position={UDim2.fromScale(0.0297, 0.472)}
                Size={UDim2.fromScale(0.735, 0.215)}
                ZIndex={17}
            />

            <imagebutton
                Key={"imageButton"}
                Image={"rbxassetid://11422142913"}
                ImageTransparency={0.5}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.964, 0.5)}
                Size={UDim2.fromScale(0.0401, 0.474)}
                ZIndex={18}
                Event={{
                    MouseButton1Click: () => {
                        if (props.locked) Toasts.failed("You do not have permission to access this page.")
                        else props.onClick()
                    }
                }}
            >
                <uiaspectratioconstraint />
            </imagebutton>
        </frame>
    )
};

export function ParagraphInfoListComponent(props: { title: string, description: string, hover?: string }) {
    return (
        <frame
            Key={"middle"}
            BackgroundColor3={Color3.fromRGB(21, 22, 25)}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            LayoutOrder={-1}
            Position={UDim2.fromScale(4.46e-08, 0.116)}
            Size={UDim2.fromScale(1, 0.2)}
            ZIndex={16}
        >
            <textlabel
                Key={"textLabel"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.title}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={14}
                TextTransparency={0.28}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.0336, 0.257)}
                Size={UDim2.fromScale(0.932, 0.226)}
                ZIndex={16}
            />

            <textlabel
                Key={"textLabel1"}
                FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
                Text={props.description}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                TextSize={30}
                TextTransparency={0.65}
                TextTruncate={Enum.TextTruncate.AtEnd}
                TextWrapped={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Interactable={false}
                Position={UDim2.fromScale(0.0336, 0.475)}
                Size={UDim2.fromScale(0.932, 0.215)}
                ZIndex={17}
            />

            <imagelabel
                Key={"imageButton"}
                Image={"rbxassetid://11432859220"}
                ImageTransparency={0.5}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                BackgroundTransparency={1}
                BorderColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={0}
                Position={UDim2.fromScale(0.962, 0.5)}
                Size={UDim2.fromScale(0.0288, 0.267)}
                ZIndex={18}
                Event={props.hover ? {
                    MouseEnter: (frame) => {
                        if (!props.hover) return

                        const anchorOffset = new Vector2((frame.AbsoluteSize.X) * frame.AnchorPoint.X, frame.AbsoluteSize.Y * frame.AnchorPoint.Y);
                        const screenSpacePosition = new Vector2((frame.AbsolutePosition.X + anchorOffset.X), frame.AbsolutePosition.Y + anchorOffset.Y);

                        Tooltip.show(screenSpacePosition, props.title, props.hover)
                    },

                    MouseLeave: (frame) => {
                        if (!props.hover) return
                        const anchorOffset = new Vector2((frame.AbsoluteSize.X) * frame.AnchorPoint.X, frame.AbsoluteSize.Y * frame.AnchorPoint.Y);
                        const screenSpacePosition = new Vector2((frame.AbsolutePosition.X + anchorOffset.X), frame.AbsolutePosition.Y + anchorOffset.Y);
                        Tooltip.hide(screenSpacePosition)
                    }
                } : {}}
            >
                <uiaspectratioconstraint />
            </imagelabel>
        </frame>
    )
}

export default function DescriptionListComponent(props: { title: string, description: string, layoutOrder?: number }): Roact.Element {
    const resolution = Workspace.CurrentCamera?.ViewportSize.Y ?? 0;
    const maxTextSize = 30;

    // Calculate the text size based on the resolution, and the maximum text size.
    let textSize = (resolution / 1080) * maxTextSize;

    return <frame
        Key={"middle"}
        BackgroundColor3={Color3.fromRGB(0, 0, 0)}
        BackgroundTransparency={0.7}
        BorderColor3={Color3.fromRGB(0, 0, 0)}
        BorderSizePixel={0}
        Position={UDim2.fromScale(0, 0.473)}
        Size={UDim2.fromScale(1, 0.588)}
        ZIndex={16}
        LayoutOrder={props.layoutOrder ?? 0}
    >
        <textlabel
            Key={"textLabel2"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.title}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={true}
            TextSize={14}
            TextTransparency={0.28}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.034, 0.164)}
            Size={UDim2.fromScale(0.938, 0.214)}
            ZIndex={16}
        />

        <textlabel
            Key={"textLabel3"}
            FontFace={new Font("rbxasset://fonts/families/SourceSansPro.json")}
            Text={props.description ?? "Not available."}
            TextColor3={Color3.fromRGB(255, 255, 255)}
            TextScaled={false}
            TextSize={textSize}
            TextTransparency={0.65}
            TextWrapped={true}
            TextXAlignment={Enum.TextXAlignment.Left}
            TextYAlignment={Enum.TextYAlignment.Top}
            BackgroundColor3={Color3.fromRGB(255, 255, 255)}
            BackgroundTransparency={1}
            BorderColor3={Color3.fromRGB(0, 0, 0)}
            BorderSizePixel={0}
            Position={UDim2.fromScale(0.034, 0.391)}
            Size={UDim2.fromScale(0.938, 0.417)}
            ZIndex={17}
        >
            <uitextsizeconstraint
                Key={"uITextSizeConstraint"}
                MaxTextSize={30}
            />
        </textlabel>
    </frame>
}

markPureComponent(ParagraphRedirectListComponent);
markPureComponent(ParagraphInfoListComponent);
markPureComponent(DescriptionListComponent);