import * as Types from './types';

export {
    getSliderPlayerTags,
    isSlideShownByActive,
    isSlideShownByLogin,
    isSlideShownBySegmentation,
    getSlides
} from '@core/js/components/main/Banner/hooks/useGetSlides/helpers';

// hc-changes - 'isHCBanner' customization
export const getSliderOptions: Types.IGetSliderOptions = ({
    bannerFeed,
    formFactor,
    isHCBanner = false
}) => {
    const feedConfiguration = bannerFeed.bannerFeedConfiguration[formFactor];

    return {
        height: isHCBanner
            ? '100vh'
            : `${feedConfiguration.bannerHeight}${feedConfiguration.bannerHeightUnits}`,
        animation: {
            displayTime: Number(feedConfiguration.slideAnimationTime) || 0,
            type: feedConfiguration.slideAnimationType || 'fade'
        },
        controls: {
            arrows: {
                enabled: feedConfiguration.isArrowsControlsEnabled,
                position: isHCBanner
                    ? ''
                    : `${feedConfiguration.arrowsControlsPosition || '0'}${
                          feedConfiguration.arrowsControlsUnits
                      }`
            },
            bullets: {
                enabled: isHCBanner
                    ? false
                    : feedConfiguration.isBulletsControlsEnabled,
                position: {
                    offsetX:
                        Number(feedConfiguration.bulletsControlsXOffset) || 0,
                    offsetY:
                        Number(feedConfiguration.bulletsControlsYOffset) || 0,
                    x: feedConfiguration.bulletsControlsXPosition || 'center',
                    y: feedConfiguration.bulletsControlsYPosition || 'bottom'
                }
            },
            progressBar: {
                enabled: feedConfiguration.isProgressBarControlsEnabled,
                position: feedConfiguration.progressBarControlsPosition
            },
            buttons: {
                enabled: false
            }
        }
    };
};
