export type Assets = {
    gear: Folder & {
        DefaultODMGear: Model,
    },

    handles: Folder & {
        DefaultGearHandle: Model,
    },

    foilage: Folder & {
        rocks: Folder,
        dirt: Folder,

        bushes: Folder,
        other: Folder,

        willows: Folder,
        pines: Folder,
        redwoods: Folder,
        oaks: Folder,
        birches: Folder,
        palms: Folder,
    },

    entities : Folder & {
        horse: Model & {
            Humanoid: Humanoid & {Animator: Animator},
            HumanoidRootPart: Part,
            Color : Folder,
            Seat : Seat,
        }
    },

    characters : Folder & {
        stablemen: Model & {
            Humanoid: Humanoid & {Animator: Animator},
            HumanoidRootPart: Part,
        },

        land_proprietor: Model & {
            Humanoid: Humanoid & {Animator: Animator},
            HumanoidRootPart: Part,
        },

        draftsman: Model & {
            Humanoid: Humanoid & {Animator: Animator},
            HumanoidRootPart: Part,
        }
    }

    blueprints: Folder & {
        buildings: Folder & {
            village: Folder & {
                village_house_1: Model,
            },

            misc: Folder & {
                watch_tower: Model,
            }
        },

        fences: Folder & {
            short: Folder & {
                short_fence_1: Model,
                short_fence_2: Model,
                short_fence_3: Model,
                short_fence_4: Model,
                short_fence_5: Model,
                short_fence_6: Model,
                short_fence_7: Model,
                short_fence_8: Model,
                short_fence_9: Model,
            },
            medium: Folder & {
                medium_fence_1: Model,
                medium_fence_2: Model,
            },
            tall: Folder & {
                tall_fence_1: Model,
                tall_fence_2: Model,
                tall_fence_3: Model,
                tall_fence_4: Model,
                tall_fence_5: Model,
            }
        }
    }

    other: Folder & {
        ClientActor : Actor & {
            Actor: LocalScript,
            Event: BindableEvent,
            Result: BindableEvent,
        }

        WallSina: Model,
        Wall : Model,
        WallSinaGrate : Model,

        Triangle: MeshPart,

        ServerActor : Actor & {
            Actor: Script,
            Event: BindableEvent,
            Result: BindableEvent,
        },

        rock_wedge : MeshPart
        hexagon : MeshPart

        DummyWorldModel: WorldModel,
        
        path_line : BasePart & {
            Attachment: Attachment,
        }

        info: CanvasGroup & {
            shadow: ImageLabel;
            TextLabel: TextLabel;
            UICorner: UICorner;
            menu: ImageLabel & {
                scale: UIScale;
                UICorner: UICorner;
            };
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            ImageLabel: ImageLabel;
        }

        area_line: BasePart & {
            A: Attachment,
            B: Attachment,
        }

        error: CanvasGroup & {
            shadow: ImageLabel;
            TextLabel: TextLabel;
            UICorner: UICorner;
            menu: ImageLabel & {
                scale: UIScale;
                UICorner: UICorner;
            };
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            ImageLabel: ImageLabel;
        }

        bubbles: Frame & {
            ["1"]: Frame & {
                UIAspectRatioConstraint: UIAspectRatioConstraint;
                Frame: Frame & {
                    UICorner: UICorner;
                };
            };
            ["0"]: Frame & {
                UIAspectRatioConstraint: UIAspectRatioConstraint;
                Frame: Frame & {
                    UICorner: UICorner;
                };
            };
            ["2"]: Frame & {
                UIAspectRatioConstraint: UIAspectRatioConstraint;
                Frame: Frame & {
                    UICorner: UICorner;
                };
            };
            UIListLayout: UIListLayout;
            UIAspectRatioConstraint: UIAspectRatioConstraint;
        }
        

        interaction_holder: Frame & {
            UIListLayout: UIListLayout;
            UIScale: UIScale;
        }        

        interaction_frame: Frame & {
            UIListLayout: UIListLayout;
            keybind: Frame & {
                button: TextLabel;
                gradient: Frame & {
                    UIGradient: UIGradient;
                    UICorner: UICorner;
                };
                UIAspectRatioConstraint: UIAspectRatioConstraint;
                UICorner: UICorner;
            };
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            label: Frame & {
                UICorner: UICorner;
                gradient: Frame & {
                    UIGradient: UIGradient;
                    UICorner: UICorner;
                };
                header: TextLabel;
                body: TextLabel;
            };
        }
        

        autofill_desc: Frame & {
            UICorner: UICorner;
            UIPadding: UIPadding;
            description: TextLabel;
            label: TextLabel;
        }

        autoscale_desc: Frame & {
            UIListLayout: UIListLayout;
            container: Frame & {
                description: TextLabel;
                label: TextLabel;
                UICorner: UICorner;
                UIListLayout: UIListLayout;
                UIPadding: UIPadding;
            };
            padder: TextLabel;
        }

        autoscale_notice: Frame & {
            UIListLayout: UIListLayout;
            container: Frame & {
                UICorner: UICorner;
                notice: TextLabel & {
                    UIPadding: UIPadding;
                };
                UIListLayout: UIListLayout;
                body: Frame & {
                    UIListLayout: UIListLayout;
                    UIPadding: UIPadding;
                    description: TextLabel;
                    label: TextLabel;
                };
            };
            padder: TextLabel;
        }


        success: CanvasGroup & {
            shadow: ImageLabel;
            TextLabel: TextLabel;
            UICorner: UICorner;
            menu: ImageLabel & {
                scale: UIScale;
                UICorner: UICorner;
            };
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            ImageLabel: ImageLabel;
        },

        tooltip: Frame & {
            ImageLabel: ImageLabel;
            body: Frame & {
                UICorner: UICorner;
                ImageLabel: ImageLabel & {
                    UIAspectRatioConstraint: UIAspectRatioConstraint;
                };
                body: TextLabel,
                header: TextLabel,
            };
        }


    }

    titans: Folder
}