import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@rsuite/icons/Close';
import MenuIcon from '@rsuite/icons/Menu';

export const Header = ({ onClick, isCollapsed }) => {
  return (
    <HeaderWrapper>
      <ReactGraphLogoContainer>
        {isCollapsed ? (
          <MenuIcon style={{ cursor: 'pointer' }} onClick={onClick} />
        ) : (
          <CloseIcon style={{ cursor: 'pointer' }} onClick={onClick} />
        )}
      </ReactGraphLogoContainer>
    </HeaderWrapper>
  );
};

export const LabelsList = (props) => {
  return (
    <div>
      {props?.labels?.map((label) => {
        return (
          <LabelWrapper
            key={label}
            borderRadius={props.borderRadius}
            style={
              props.styles && props.styles[label]
                ? props.styles[label]
                : { color: '#e7e7e7', background: '#A5ABB6' }
            }
          >
            <Label>
              <CheckBox
                type="checkbox"
                onChange={props.handleCheckBoxChange}
                id={label}
                name={label}
                value={label}
                checked={props.checkedLabels.includes(label)}
              />
              <label style={{ marginLeft: '5px' }} htmlFor={label}>
                {' '}
                {label}
              </label>
            </Label>
          </LabelWrapper>
        );
      })}
    </div>
  );
};

export const HeaderWrapper = styled.div`
  width: 270px;
  min-height: 60px;
  height: 60px;
  background-color: #f0f0f0;
  border-bottom: solid 1px #ddd;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  position: absolute;
  z-index: 1001;
  color: #333;
`;

export const SideBarWrapper = styled.div`
  box-sizing: border-box;
  height: 160vh;
  min-height: 100%;
  max-height: 100%;
  border-right: solid 1px #ececec;
  .pro-sidebar {
    .pro-sidebar-inner {
      background: #f6f6f6;

      .pro-sidebar-layout {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .pro-menu {
        overflow-x: hidden;
        overflow-y: scroll;
        margin-top: 72px;

        .pro-inner-item {
          font-weight: bold;
          color: #666;
          &:hover {
            color: #333;
          }
          &:focus {
            outline: 0;
          }

          .pro-icon-wrapper {
            background-color: #a8b7c5;
          }
        }

        .pro-sub-menu {
          .pro-inner-list-item {
            background: #e9e6e6;
          }
        }

        .popper-element {
          display: ${(props) => (!props.isCollapsed ? 'none' : 'inherit')};
          // Fix popper-element on left-top. May cause layout issue for few labels/types
          //transform: translate3d(80px, 74px, 0) !important;
          .popper-inner {
            background-color: #fff3f3 !important;
          }
        }
      }
    }
  }
`;

export const LabelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 270px;
  h3 {
    margin: 0 0 8px 0;
  }
`;

export const StyledToken = styled.div`
  display: inline-block;
  font-weight: bold;
  line-height: 1em;
  white-space: nowrap;
  user-select: none;
  font-size: 12px;
  margin: 4px;
`;

export const LabelWrapper = styled(StyledToken)`
  padding: 5px 10px;
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : '10px')};
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  * {
    cursor: pointer;
  }
`;

export const CheckBox = styled.input`
  margin-left: 0;
`;

export const ReactGraphLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
  font-size: 25px;
  font-weight: bold;
`;
